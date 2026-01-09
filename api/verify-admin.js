/**
 * Vercel Serverless Function: verify-admin
 * Securely verifies admin password without exposing it to the frontend.
 */

export default async function handler(request, response) {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { password } = request.body;

        // Validate input
        if (!password) {
            return response.status(400).json({
                valid: false,
                error: 'Password is required'
            });
        }

        // Server-side password check (not exposed to browser)
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD environment variable not set');
            return response.status(500).json({
                valid: false,
                error: 'Server configuration error'
            });
        }

        // Compare passwords
        if (password === ADMIN_PASSWORD) {
            return response.status(200).json({
                valid: true,
                message: 'Authentication successful'
            });
        }

        // Invalid password
        return response.status(401).json({
            valid: false,
            error: 'Invalid password'
        });

    } catch (error) {
        console.error('Admin verification error:', error);
        return response.status(500).json({
            valid: false,
            error: 'Internal server error'
        });
    }
}
