/**
 * Vercel Serverless Function: IPN (Instant Payment Notification)
 * Receives payment status callbacks from Pesapal.
 * This endpoint is called by Pesapal when a payment is completed.
 */

export default async function handler(request, response) {
    // Log all incoming requests for debugging
    console.log('IPN Request received:', {
        method: request.method,
        query: request.query,
        headers: {
            'user-agent': request.headers['user-agent'],
            'x-forwarded-for': request.headers['x-forwarded-for']
        }
    });

    // 1. Method Validation - Pesapal uses GET for IPN callbacks
    if (request.method !== 'GET') {
        console.warn('Invalid method for IPN:', request.method);
        return response.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Extract Parameters from Query String
    // Pesapal sends: OrderTrackingId and OrderMerchantReference
    const { OrderTrackingId, OrderMerchantReference } = request.query;

    if (!OrderTrackingId || !OrderMerchantReference) {
        console.error('Missing required IPN parameters:', request.query);
        return response.status(400).json({
            error: 'Missing OrderTrackingId or OrderMerchantReference'
        });
    }

    console.log('Processing IPN notification:', {
        trackingId: OrderTrackingId,
        merchantRef: OrderMerchantReference
    });

    try {
        // 3. Call verify-payment internally to process the payment
        // Construct the full URL for the verify-payment endpoint
        const protocol = request.headers['x-forwarded-proto'] || 'https';
        const host = request.headers.host;
        const baseUrl = `${protocol}://${host}`;

        const verifyUrl = `${baseUrl}/api/pesapal/verify-payment?trackingId=${OrderTrackingId}&merchantRef=${OrderMerchantReference}`;

        console.log('Calling verify-payment endpoint:', verifyUrl);

        const verifyResponse = await fetch(verifyUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-secret': process.env.INTERNAL_API_SECRET
            }
        });

        const verifyData = await verifyResponse.json();

        console.log('Verify-payment response:', {
            status: verifyResponse.status,
            data: verifyData
        });

        if (!verifyResponse.ok) {
            throw new Error(`Verification failed: ${JSON.stringify(verifyData)}`);
        }

        // 4. Return success to Pesapal
        // Pesapal expects a 200 OK response to confirm IPN was received
        return response.status(200).json({
            success: true,
            message: 'IPN processed successfully',
            orderTrackingId: OrderTrackingId,
            merchantReference: OrderMerchantReference
        });

    } catch (error) {
        console.error('IPN Processing Error:', error.message);

        // Still return 200 to Pesapal to prevent retries
        // We log the error but acknowledge receipt
        return response.status(200).json({
            success: false,
            message: 'IPN received but processing encountered an error',
            error: error.message
        });
    }
}
