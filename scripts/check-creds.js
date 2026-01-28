import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const PESA_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESA_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESA_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';

async function checkCreds() {
    console.log('--- PesaPal Credentials Verification ---');
    console.log(`Base URL: ${PESA_BASE_URL}`);
    console.log(`Using Key: ${PESA_KEY ? 'Set' : 'MISSING'}`);
    console.log(`Using Secret: ${PESA_SECRET ? 'Set' : 'MISSING'}`);

    if (!PESA_KEY || !PESA_SECRET) {
        console.error('Error: PESAPAL_CONSUMER_KEY or PESAPAL_CONSUMER_SECRET is missing in .env files.');
        process.exit(1);
    }

    try {
        console.log('\nAttempting handshake...');
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

        const data = await authResponse.json();

        if (authResponse.ok) {
            console.log('✅ SUCCESS! Connection to PesaPal established.');
            console.log(`Token received: ${data.token.slice(0, 10)}... (truncated)`);
            console.log(`Expiry: ${data.expiryDate}`);
        } else {
            console.log('❌ FAILED: PesaPal rejected the credentials.');
            console.log(`Error Response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        console.error('❌ ERROR: Could not reach PesaPal API.');
        console.error(error.message);
    }
}

checkCreds();
