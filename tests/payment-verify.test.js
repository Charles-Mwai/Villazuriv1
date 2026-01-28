import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../api/pesapal/verify-payment.js';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => {
    const mockUpdate = vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockReturnValue({ error: null })
    }));

    const mockSingle = vi.fn().mockImplementation(() => ({
        data: { id: 'booking-123', guest_email: 'test@example.com', total_cost: 100 },
        error: null
    }));

    const mockSelect = vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockReturnValue({ single: mockSingle })
    }));

    return {
        createClient: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
                select: mockSelect,
                update: mockUpdate
            })
        })
    };
});

// Mock Global Fetch
global.fetch = vi.fn();

describe('PesaPal Payment Verification API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.PESAPAL_CONSUMER_KEY = 'test-key';
        process.env.PESAPAL_CONSUMER_SECRET = 'test-secret';
        process.env.SUPABASE_URL = 'https://test.supabase.co';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-role-key';
    });

    it('should confirm booking when PesaPal returns Completed', async () => {
        // 1. Mock Auth Token Response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'mock-token' })
        });

        // 2. Mock Status Response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                payment_status_description: 'Completed',
                payment_method: 'MPESA'
            })
        });

        // 3. Mock internal trigger to send-confirmation
        fetch.mockResolvedValueOnce({ ok: true });

        const req = {
            method: 'GET',
            query: { trackingId: 'track-123', merchantRef: 'booking-123' },
            headers: { host: 'localhost:3000' }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            status: 'Completed'
        }));
    });

    it('should return success:false when PesaPal returns Failed', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'mock-token' })
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                payment_status_description: 'Failed'
            })
        });

        const req = {
            method: 'GET',
            query: { trackingId: 'track-123', merchantRef: 'booking-123' },
            headers: { host: 'localhost:3000' }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            status: 'Failed'
        }));
    });

    it('should handle PesaPal auth failure gracefully', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid Credentials' })
        });

        const req = {
            method: 'GET',
            query: { trackingId: 'track-123', merchantRef: 'booking-123' }
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: expect.stringContaining('PesaPal Auth Failed')
        }));
    });
});
