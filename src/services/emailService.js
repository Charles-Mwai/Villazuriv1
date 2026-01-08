/**
 * emailService.js
 * Frontend service to trigger booking confirmation emails.
 */

/**
 * Sends a booking confirmation email by calling the backend serverless function.
 * @param {Object} booking - The booking object from Supabase or dummy state.
 * @param {number} totalCost - The total cost of the booking.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
/**
 * Sends a booking confirmation email by calling the backend serverless function.
 * Includes a retry mechanism for improved reliability.
 * @param {Object} booking - The booking object from Supabase.
 * @param {number} totalCost - The total cost of the booking.
 * @param {number} retries - Number of retry attempts (default 3).
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendBookingConfirmation = async (booking, totalCost, retries = 3) => {
    let lastError = null;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch('/api/send-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ booking, totalCost }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send confirmation email');
            }

            const result = await response.json();
            console.log('Email sent successfully on attempt', i + 1, ':', result);
            return { success: true };
        } catch (error) {
            lastError = error;
            console.warn(`Email attempt ${i + 1} failed:`, error.message);
            // Wait before retrying (exponential backoff: 500ms, 1000ms, 2000ms)
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 500));
            }
        }
    }

    console.error('Email Service Error after', retries, 'attempts:', lastError);
    return { success: false, error: lastError.message };
};
