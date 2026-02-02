import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const testPaymentFlow = async () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const internalSecret = process.env.INTERNAL_API_SECRET;
    const guestEmail = 'mwaiwanjiku87@gmail.com';

    if (!supabaseUrl || !supabaseKey || !internalSecret) {
        console.error('Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INTERNAL_API_SECRET)');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        console.log('--- Step 1: Creating a test booking ---');
        const { data: booking, error: createError } = await supabase
            .from('bookings')
            .insert([{
                check_in: new Date().toISOString().split('T')[0],
                check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                nights: 1,
                guests: 2,
                guest_name: 'Test Guest Mwai',
                guest_email: guestEmail,
                guest_phone: '+254712345678',
                total_cost: 1.00,
                status: 'pending'
            }])
            .select()
            .single();

        if (createError) throw createError;
        console.log(`Booking created with ID: ${booking.id}`);

        console.log('\n--- Step 2: Simulating PesaPal IPN Verification ---');
        // We will call the live verify-payment endpoint to ensure production fixes are working
        // If testing locally, ensure you have the server running or mock the call
        const baseUrl = 'https://villazuri.co.ke';
        const trackingId = `TEST-TRACK-${Date.now()}`;
        const verifyUrl = `${baseUrl}/api/pesapal/verify-payment?trackingId=${trackingId}&merchantRef=${booking.id}&simulation=true`;

        console.log(`Calling Verification API: ${verifyUrl}`);

        // Note: For this to work in production, the x-internal-secret must match
        const response = await fetch(verifyUrl, {
            method: 'GET',
            headers: {
                'x-internal-secret': internalSecret,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log('Verification Response Status:', response.status);
        console.log('Verification Result:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('\n--- Step 3: Verifying Database Update ---');
            const { data: updatedBooking, error: fetchError } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', booking.id)
                .single();

            if (fetchError) throw fetchError;
            console.log(`Current Booking Status: ${updatedBooking.status}`);
            console.log(`Payment Status: ${updatedBooking.payment_status}`);

            if (updatedBooking.status === 'confirmed') {
                console.log('\n✅ SUCCESS! The booking was correctly updated to "confirmed" (booked).');
                console.log('Check the emails for mwaiwanjiku87@gmail.com and admin@villazuri.co.ke.');
            } else {
                console.log('\n❌ FAILED. Status was not updated.');
            }
        } else {
            console.log('\n❌ FAILED. API returned an error.');
        }

    } catch (error) {
        console.error('\n🔴 Error during test:', error.message);
    }
};

testPaymentFlow();
