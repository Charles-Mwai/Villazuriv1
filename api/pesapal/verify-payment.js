import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: verify-payment
 * Authenticates with PesaPal and verifies the status of a transaction.
 */

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { trackingId, merchantRef } = request.query;

    if (!trackingId || !merchantRef) {
        return response.status(400).json({ error: 'Missing trackingId or merchantRef' });
    }

    // 2. Security Validation (Origin check or Internal Secret)
    const origin = request.headers.origin;
    const internalSecret = request.headers['x-internal-secret'];
    const expectedSecret = process.env.INTERNAL_API_SECRET;

    const isInternalCall = internalSecret && internalSecret === expectedSecret;

    const allowedOrigins = [
        'https://villazurimvp.vercel.app',
        'https://villazuri.co.ke',
        'https://www.villazuri.co.ke'
    ];

    if (process.env.NODE_ENV === 'production') {
        if (!isInternalCall && (!origin || !allowedOrigins.includes(origin))) {
            console.warn('Unauthorized origin attempt on verify-payment:', { origin, isInternalCall });
            return response.status(403).json({ error: 'Forbidden: Unauthorized origin' });
        }
    }

    const PESA_KEY = process.env.PESAPAL_CONSUMER_KEY;
    const PESA_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
    const PESA_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';
    const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

    try {
        // 1. Get Authentication Token from PesaPal
        const authResponse = await fetch(`${PESA_BASE_URL}/api/Auth/RequestToken`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                consumer_key: PESA_KEY,
                consumer_secret: PESA_SECRET
            })
        });

        if (!authResponse.ok) {
            const authError = await authResponse.json();
            throw new Error(`PesaPal Auth Failed: ${JSON.stringify(authError)}`);
        }

        const { token } = await authResponse.json();

        // 2. Get Transaction Status from PesaPal
        const statusResponse = await fetch(`${PESA_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${trackingId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!statusResponse.ok) {
            const statusError = await statusResponse.json();
            throw new Error(`PesaPal Status Check Failed: ${JSON.stringify(statusError)}`);
        }

        const transactionData = await statusResponse.json();
        const paymentStatus = transactionData.payment_status_description; // "Completed", "Pending", "Failed"

        // 3. Update Supabase based on status
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Fetch booking first to get guest email for internal trigger
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', merchantRef)
            .single();

        if (fetchError || !booking) {
            throw new Error('Booking not found in database');
        }

        if (paymentStatus === 'Completed') {
            // IDEMPOTENCY CHECK: Only process if the current status is 'pending'
            if (booking.status === 'confirmed' || booking.status === 'paid') {
                console.log(`Booking ${merchantRef} is already ${booking.status}. Skipping duplicate processing.`);
                return response.status(200).json({
                    success: true,
                    status: booking.status,
                    message: `Payment already processed. Booking is ${booking.status}.`
                });
            }

            // Update status to confirmed
            const { error: updateError } = await supabase
                .from('bookings')
                .update({
                    status: 'confirmed',
                    payment_id: trackingId,
                    payment_status: paymentStatus,
                    payment_method: transactionData.payment_method || 'Pesapal',
                    updated_at: new Date().toISOString()
                })
                .eq('id', merchantRef);

            if (updateError) throw updateError;

            // 4. Trigger Confirmation Email
            // We'll call our existing send-confirmation API internally
            // Since this is a serverless function calling another on the same domain, 
            // we use the full URL or a relative one if the environment allows.
            // On Vercel, we can try to trigger it via fetch.
            const protocol = request.headers['x-forwarded-proto'] || 'http';
            const host = request.headers.host;
            const baseUrl = `${protocol}://${host}`;

            try {
                await fetch(`${baseUrl}/api/send-confirmation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-internal-secret': INTERNAL_SECRET
                    },
                    body: JSON.stringify({ booking, totalCost: booking.total_cost })
                });
            } catch (emailErr) {
                console.error('Failed to trigger confirmation email internally:', emailErr);
                // We don't fail the whole request because the payment IS confirmed in DB
            }

            return response.status(200).json({
                success: true,
                status: 'Completed',
                message: 'Payment verified and booking confirmed.'
            });
        } else {
            // Update payment status even if failed/pending for audit
            await supabase
                .from('bookings')
                .update({
                    payment_status: paymentStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', merchantRef);

            return response.status(200).json({
                success: false,
                status: paymentStatus,
                message: `Payment status is ${paymentStatus}.`
            });
        }

    } catch (error) {
        console.error('Verification Error:', error.message);
        return response.status(500).json({ error: error.message });
    }
}
