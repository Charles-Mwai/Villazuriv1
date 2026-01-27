import jwt from 'jsonwebtoken';

/**
 * VERCEL_FUNCTION_TIMEOUT: 10
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

        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        const JWT_SECRET = process.env.JWT_SECRET || ADMIN_PASSWORD; // Fallback to password as secret if not set

        if (!ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD environment variable not set');
            return response.status(500).json({
                valid: false,
                error: 'Server configuration error'
            });
        }

        // Compare passwords
        if (password === ADMIN_PASSWORD) {
            // Generate a secure JWT
            const token = jwt.sign(
                {
                    role: 'admin',
                    authenticated: true,
                    iat: Math.floor(Date.now() / 1000)
                },
                JWT_SECRET,
                { expiresIn: '2h' }
            );

            return response.status(200).json({
                valid: true,
                token,
                message: 'Authentication successful',
                expiresIn: 7200 // 2 hours in seconds
            });
        }

        // --- Basic Rate Limiting / Brute Force Protection ---
        // Sleep for 2 seconds on failure to slow down automated attacks
        await new Promise(resolve => setTimeout(resolve, 2000));

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
