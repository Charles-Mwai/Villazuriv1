import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: weekly-report
 * Triggered by Vercel Cron to send a booking summary to the admin email.
 */

export default async function handler(request, response) {
    // 1. Security Validation
    // Vercel Cron sends an Authorization header with the CRON_SECRET
    const authHeader = request.headers['authorization'];
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return response.status(401).json({ error: 'Unauthorized: Missing or invalid CRON_SECRET' });
    }

    // 2. Initialize Supabase
    const supabase = createClient(
        process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        // 3. Define the reporting window (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateStr = sevenDaysAgo.toISOString();

        // 4. Fetch bookings from the last 7 days
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .gte('created_at', dateStr)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 5. Aggregate Statistics
        const stats = {
            total: bookings.length,
            confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'paid').length,
            pending: bookings.filter(b => b.status === 'pending').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
            totalRevenue: bookings
                .filter(b => b.status === 'confirmed' || b.status === 'paid')
                .reduce((sum, b) => sum + parseFloat(b.total_cost || 0), 0)
        };

        // 6. Generate HTML Content for the Email
        const ADMIN_EMAIL = process.env.ADMIN_RECEIVING_EMAIL || 'admin@villazuri.co.ke';
        const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'system@villazuri.co.ke';
        const BREVO_API_KEY = process.env.BREVO_API_KEY;

        const reportHtml = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 30px;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0A2342; padding-bottom: 20px;">
                    <h1 style="color: #0A2342; margin: 0;">Weekly Booking Report</h1>
                    <p style="color: #666; font-size: 14px;">Villa Zuri | ${new Date().toLocaleDateString('en-GB')}</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <span style="font-size: 12px; color: #666; display: block; text-transform: uppercase;">Total Requests</span>
                        <strong style="font-size: 24px; color: #0A2342;">${stats.total}</strong>
                    </div>
                    <div style="background: #e6f3ff; padding: 15px; border-radius: 8px; text-align: center;">
                        <span style="font-size: 12px; color: #004085; display: block; text-transform: uppercase;">Confirmed Revenue</span>
                        <strong style="font-size: 24px; color: #004085;">$${stats.totalRevenue.toLocaleString()}</strong>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="color: #0A2342; border-bottom: 1px solid #eee; padding-bottom: 8px;">Breakdown by Status</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px 0;"><strong>Confirmed/Paid</strong></td>
                            <td style="padding: 10px 0; text-align: right; color: #28a745;">${stats.confirmed}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px 0;"><strong>Pending</strong></td>
                            <td style="padding: 10px 0; text-align: right; color: #ffc107;">${stats.pending}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px 0;"><strong>Cancelled</strong></td>
                            <td style="padding: 10px 0; text-align: right; color: #dc3545;">${stats.cancelled}</td>
                        </tr>
                    </table>
                </div>

                ${stats.total > 0 ? `
                <div>
                    <h3 style="color: #0A2342; border-bottom: 1px solid #eee; padding-bottom: 8px;">Recent Activity</h3>
                    <table style="width: 100%; font-size: 13px;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="text-align: left; padding: 8px;">Guest</th>
                                <th style="text-align: left; padding: 8px;">Check-in</th>
                                <th style="text-align: right; padding: 8px;">Total</th>
                                <th style="text-align: right; padding: 8px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bookings.slice(0, 10).map(b => `
                                <tr style="border-bottom: 1px solid #f0f0f0;">
                                    <td style="padding: 8px;">${b.guest_name}</td>
                                    <td style="padding: 8px;">${new Date(b.check_in).toLocaleDateString()}</td>
                                    <td style="padding: 8px; text-align: right;">$${parseFloat(b.total_cost).toLocaleString()}</td>
                                    <td style="padding: 8px; text-align: right;">
                                        <span style="padding: 2px 6px; border-radius: 4px; font-size: 11px; background: ${b.status === 'confirmed' || b.status === 'paid' ? '#d4edda' : b.status === 'cancelled' ? '#f8d7da' : '#fff3cd'}; color: ${b.status === 'confirmed' || b.status === 'paid' ? '#155724' : b.status === 'cancelled' ? '#721c24' : '#856404'};">
                                            ${b.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${stats.total > 10 ? `<p style="text-align: center; color: #999; font-size: 12px;">+ ${stats.total - 10} more bookings in the dashboard</p>` : ''}
                </div>
                ` : '<p style="text-align: center; color: #999;">No booking activity reported for this period.</p>'}

                <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #0A2342; text-align: center;">
                    <a href="https://villazuri.co.ke/admin" style="display: inline-block; background: #0A2342; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Admin Dashboard</a>
                </div>
            </div>
        `;

        // 7. Send Email via Brevo
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { name: 'Villa Zuri Systems', email: SENDER_EMAIL },
                to: [{ email: ADMIN_EMAIL, name: 'Villa Zuri Administrator' }],
                subject: `Weekly Booking Summary - ${new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })}`,
                htmlContent: reportHtml
            })
        });

        if (!brevoResponse.ok) {
            const errBody = await brevoResponse.json();
            throw new Error(`Brevo Error: ${JSON.stringify(errBody)}`);
        }

        return response.status(200).json({ success: true, stats });

    } catch (err) {
        console.error('Weekly Report Error:', err);
        return response.status(500).json({ error: err.message });
    }
}
