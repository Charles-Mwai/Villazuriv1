import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const registerIPN = async () => {
    const consumer_key = process.env.PESAPAL_CONSUMER_KEY;
    const consumer_secret = process.env.PESAPAL_CONSUMER_SECRET;
    const baseUrl = process.env.PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';

    if (!consumer_key || !consumer_secret) {
        console.error('Missing Pesapal credentials in .env.local');
        return;
    }

    try {
        // 1. Authenticate
        console.log('Authenticating...');
        const authRes = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ consumer_key, consumer_secret })
        });

        if (!authRes.ok) {
            throw new Error(JSON.stringify(await authRes.json()));
        }

        const { token } = await authRes.json();
        console.log('Authenticated!');

        // 2. Register IPN
        // We use the production URL because localhost won't be reachable by Pesapal
        const ipnUrl = 'https://villazuri.co.ke/api/pesapal/ipn';
        console.log(`Registering IPN URL: ${ipnUrl}`);

        const ipnRes = await fetch(`${baseUrl}/api/URLSetup/RegisterIPN`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                url: ipnUrl,
                ipn_notification_type: 'GET' // or POST, usually GET for simple query param callback, or POST for body
            })
        });

        const ipnData = await ipnRes.json();
        console.log('Registration Response:', JSON.stringify(ipnData, null, 2));

        if (ipnData.ipn_id) {
            console.log('\nSUCCESS! Use this IPN ID in your create-order.js:');
            console.log(ipnData.ipn_id);
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

registerIPN();
