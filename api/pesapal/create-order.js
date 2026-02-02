export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, email, phoneNumber, firstName, lastName, reference, description } = request.body;

    if (!amount || !email || !reference) {
        return response.status(400).json({ error: 'Missing required fields' });
    }

    const PESA_KEY = process.env.PESAPAL_CONSUMER_KEY;
    const PESA_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
    const PESA_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';

    try {
        // 1. Authenticate
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
            const error = await authResponse.json();
            throw new Error(`Auth Failed: ${JSON.stringify(error)}`);
        }

        const { token } = await authResponse.json();

        // 2. Submit Order
        // Dynamic callback URL construction
        const protocol = request.headers['x-forwarded-proto'] || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
        const host = request.headers.host;
        const callbackUrl = `${protocol}://${host}/checkout/confirmation`;

        // Notification ID is optional but recommended if you have an IPN set up. 
        // For now, we will rely on the redirect callback.

        const orderData = {
            id: reference,
            currency: "USD",
            amount: parseFloat(amount),
            description: description || `Booking ${reference}`,
            callback_url: callbackUrl,
            notification_id: process.env.PESAPAL_IPN_ID || "7eb20d54-4b80-48b4-aa99-dac9f061bd70",
            billing_address: {
                email_address: email,
                phone_number: phoneNumber || "",
                country_code: "",
                first_name: firstName || "",
                middle_name: "",
                last_name: lastName || "",
                line_1: "",
                line_2: "",
                city: "",
                state: "",
                postal_code: "",
                zip_code: ""
            }
        };

        const orderResponse = await fetch(`${PESA_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!orderResponse.ok) {
            const error = await orderResponse.json();
            throw new Error(`Order Submission Failed: ${JSON.stringify(error)}`);
        }

        const orderResult = await orderResponse.json();

        if (!orderResult.redirect_url) {
            throw new Error(`No redirect_url in response. Got: ${JSON.stringify(orderResult)}`);
        }

        return response.status(200).json({
            success: true,
            redirectUrl: orderResult.redirect_url,
            orderTrackingId: orderResult.order_tracking_id,
            merchantReference: orderResult.merchant_reference
        });

    } catch (error) {
        console.error('Pesapal Create Order Error:', error);
        console.error('Request Body Was:', request.body);
        return response.status(500).json({ error: error.message });
    }
}
