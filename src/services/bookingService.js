import { supabase } from '../config/supabase';

/**
 * Check if dates are available (no overlapping bookings)
 * @param {Date} checkIn - Check-in date
 * @param {Date} checkOut - Check-out date
 * @returns {Promise<{available: boolean, overlappingBookings: Array}>}
 */
export const checkAvailability = async (checkIn, checkOut) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .in('status', ['confirmed', 'paid'])
            .or(`and(check_in.lte.${checkOut},check_out.gte.${checkIn})`);

        if (error) throw error;

        return {
            available: data.length === 0,
            overlappingBookings: data
        };
    } catch (error) {
        console.error('Error checking availability:', error);
        throw error;
    }
};

/**
 * Get all confirmed bookings within a date range
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Promise<Array>}
 */
export const getBookingsByDateRange = async (startDate, endDate) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .in('status', ['confirmed', 'paid'])
            .gte('check_in', startDate.toISOString().split('T')[0])
            .lte('check_out', endDate.toISOString().split('T')[0])
            .order('check_in', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

/**
 * Get all booked dates for calendar display
 * @returns {Promise<Array<string>>} Array of date strings in YYYY-MM-DD format
 */
export const getAllBookedDates = async () => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('check_in, check_out')
            .in('status', ['confirmed', 'paid']);

        if (error) throw error;

        // Generate array of all dates between check_in and check_out for each booking
        const bookedDates = new Set();

        data.forEach(booking => {
            const start = new Date(booking.check_in);
            const end = new Date(booking.check_out);

            // Iterate through all dates in the range
            const currentDate = new Date(start);
            while (currentDate <= end) {
                bookedDates.add(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return Array.from(bookedDates);
    } catch (error) {
        console.error('Error fetching booked dates:', error);
        return []; // Return empty array on error to avoid breaking UI
    }
};

/**
 * Create a new booking
 * @param {Object} bookingData 
 * @returns {Promise<Object>}
 */
export const createBooking = async (bookingData) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                check_in: bookingData.checkIn,
                check_out: bookingData.checkOut,
                nights: bookingData.nights,
                guests: bookingData.guests,
                guest_name: bookingData.guestName,
                guest_email: bookingData.guestEmail,
                guest_phone: bookingData.guestPhone,
                dates_flexible: bookingData.datesFlexible,
                total_cost: bookingData.totalCost,
                services: bookingData.services || [],
                activities: bookingData.activities || [],
                status: 'pending' // Will be updated to 'confirmed' after payment
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

/**
 * Update booking status
 * @param {string} bookingId 
 * @param {string} status 
 * @returns {Promise<Object>}
 */
export const updateBookingStatus = async (bookingId, status) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
};

/**
 * Get all pricing rules for cost calculation
 * @returns {Promise<Array>}
 */
export const getAllPricingRules = async () => {
    try {
        const { data, error } = await supabase
            .from('pricing')
            .select('*')
            .order('start_date', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching pricing rules:', error);
        return [];
    }
};
/**
 * Get single booking by ID
 * @param {string} bookingId 
 * @returns {Promise<Object>}
 */
export const getBookingById = async (bookingId) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
};
