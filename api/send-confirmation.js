import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: send-confirmation
 * Sends a booking confirmation email via Brevo REST API with added security.
 */

export default async function handler(request, response) {
    // 1. Method Validation
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Origin / Security Validation (beefing up security)
    const origin = request.headers.origin;
    const allowedOrigins = [
        'http://localhost:5173',
        'https://villazurimvp.vercel.app/', // Update with actual production URL
        'https://villazuri.com'
    ];

    if (process.env.NODE_ENV === 'production' && (!origin || !allowedOrigins.includes(origin))) {
        console.warn('Unauthorized origin attempt:', origin);
        return response.status(403).json({ error: 'Forbidden: Unauthorized origin' });
    }

    // 3. Data Sanitization & Extraction
    const { booking, totalCost } = request.body;

    if (!booking || !booking.id || !booking.guest_email) {
        return response.status(400).json({ error: 'Missing or malformed booking details' });
    }

    // 4. Booking Verification (Supabase)
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role to bypass RLS for pending bookings
    );

    try {
        const { data: dbBooking, error: dbError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', booking.id)
            .single();

        if (dbError || !dbBooking) {
            console.error('Booking verification failed:', dbError);
            return response.status(404).json({ error: 'Legitimate booking not found' });
        }

        // Verify email matches to prevent spoofing
        if (dbBooking.guest_email.toLowerCase() !== booking.guest_email.toLowerCase()) {
            return response.status(403).json({ error: 'Data mismatch: Email verification failed' });
        }

        // 5. Brevo API Integration
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
        const SENDER_NAME = 'Villa Zuri Reservations';

        if (!BREVO_API_KEY || !SENDER_EMAIL) {
            console.error('Missing Brevo configuration in environment variables');
            return response.status(500).json({ error: 'Server configuration error' });
        }

        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { name: SENDER_NAME, email: SENDER_EMAIL },
                to: [{ email: dbBooking.guest_email, name: dbBooking.guest_name }],
                subject: `Booking Confirmed: #${dbBooking.id.slice(0, 8)} - Villa Zuri`,
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #0A2342; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Booking Confirmation</h2>
                        <p>Dear ${dbBooking.guest_name},</p>
                        <p>Thank you for choosing <strong>Villa Zuri</strong>. We are delighted to confirm your reservation.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #0A2342;">Reservation Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Booking ID:</strong></td>
                                    <td>#${dbBooking.id.slice(0, 8)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Check-in:</strong></td>
                                    <td>${new Date(dbBooking.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Check-out:</strong></td>
                                    <td>${new Date(dbBooking.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Guests:</strong></td>
                                    <td>${dbBooking.guests} Adults</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-top: 1px solid #ddd;"><strong>Total Amount:</strong></td>
                                    <td style="padding: 10px 0; border-top: 1px solid #ddd;"><strong>$${parseFloat(dbBooking.total_cost).toLocaleString()}</strong></td>
                                </tr>
                            </table>
                        </div>
                        
                        <p>We look forward to welcoming you to our private luxury escape. If you have any special requests or need assistance with transfers, please reply to this email.</p>
                        
                        <p style="margin-top: 30px;">Warm regards,<br>The Villa Zuri Team</p>
                        
                        <div style="font-size: 12px; color: #999; margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
                            Villa Zuri, Watamu, Kenya<br>
                            <a href="https://villazuri.com" style="color: #D4AF37; text-decoration: none;">www.villazuri.com</a>
                        </div>
                    </div>
                `
            })
        });

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.json();
            console.error('Brevo API Error:', errorData);
            return response.status(502).json({ error: 'Failed to send email via Brevo' });
        }

        const data = await brevoResponse.json();
        return response.status(200).json({ success: true, messageId: data.messageId });

    } catch (error) {
        console.error('Critical Serverless Error:', error);
        return response.status(500).json({ error: 'Internal server error occurred' });
    }
}
