import { JWT } from 'google-auth-library';
import jwt from 'jsonwebtoken';

/**
 * Vercel Serverless Function: analytics-report
 * Fetches GA4 dimensions and metrics for the admin dashboard.
 */

export default async function handler(request, response) {
    // 1. Authenticate Admin Session
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;

    try {
        jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return response.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    // 2. Initialize Google Auth
    const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!GA_PROPERTY_ID || !clientEmail || !privateKey) {
        return response.status(500).json({ error: 'Server configuration error: GA credentials missing' });
    }

    const client = new JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    try {
        await client.authorize();
        const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`;

        // 3. Define the metrics and dimensions we want
        const reportBody = {
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [
                { name: 'city' },
                { name: 'country' },
                { name: 'pagePath' }
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'bounceRate' },
                { name: 'userEngagementDuration' }
            ]
        };

        const gaResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${client.credentials.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportBody),
        });

        if (!gaResponse.ok) {
            const errData = await gaResponse.json();
            throw new Error(`GA API Error: ${JSON.stringify(errData)}`);
        }

        const data = await gaResponse.json();

        // 4. Transform and return data
        return response.status(200).json(data);

    } catch (error) {
        console.error('Analytics API Error:', error);
        return response.status(500).json({ error: error.message });
    }
}
