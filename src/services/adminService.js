import { supabase } from '../config/supabase';

/**
 * Get all bookings with optional filtering
 * @param {Object} filters - { status, search }
 * @returns {Promise<Array>}
 */
export const getAllBookings = async (filters = {}) => {
    try {
        let query = supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by status if provided
        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
        }

        // Search by name or email
        if (filters.search) {
            query = query.or(`guest_name.ilike.%${filters.search}%,guest_email.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        throw error;
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

/**
 * Update booking status
 * @param {string} bookingId 
 * @param {string} newStatus 
 * @returns {Promise<Object>}
 */
export const updateBookingStatus = async (bookingId, newStatus) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
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
 * Delete booking
 * @param {string} bookingId 
 * @returns {Promise<void>}
 */
export const deleteBooking = async (bookingId) => {
    try {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
};

/**
 * Get booking statistics with enhanced metrics
 * @returns {Promise<Object>}
 */
export const getBookingStats = async () => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*');

        if (error) throw error;

        // Basic stats
        const paidBookings = data.filter(b => b.status === 'paid');
        const confirmedBookings = data.filter(b => b.status === 'confirmed');
        const activeBookings = [...paidBookings, ...confirmedBookings];

        // Calculate average booking value
        const avgBookingValue = activeBookings.length > 0
            ? activeBookings.reduce((sum, b) => sum + parseFloat(b.total_cost), 0) / activeBookings.length
            : 0;

        // Calculate occupancy rate for next 30 days
        const today = new Date();
        const next30Days = new Date(today);
        next30Days.setDate(today.getDate() + 30);

        const bookedNights = activeBookings.filter(b => {
            const checkIn = new Date(b.check_in);
            const checkOut = new Date(b.check_out);
            return checkIn <= next30Days && checkOut >= today;
        }).reduce((sum, b) => {
            const checkIn = new Date(b.check_in);
            const checkOut = new Date(b.check_out);
            const start = checkIn > today ? checkIn : today;
            const end = checkOut < next30Days ? checkOut : next30Days;
            const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return sum + Math.max(0, nights);
        }, 0);

        const occupancyRate = (bookedNights / 30) * 100;

        // Count upcoming check-ins (next 7 days)
        const next7Days = new Date(today);
        next7Days.setDate(today.getDate() + 7);

        const upcomingCheckIns = activeBookings.filter(b => {
            const checkIn = new Date(b.check_in);
            return checkIn >= today && checkIn <= next7Days;
        }).length;

        const stats = {
            total: data.length,
            pending: data.filter(b => b.status === 'pending').length,
            confirmed: confirmedBookings.length,
            paid: paidBookings.length,
            cancelled: data.filter(b => b.status === 'cancelled').length,
            totalRevenue: paidBookings.reduce((sum, b) => sum + parseFloat(b.total_cost), 0),
            avgBookingValue: Math.round(avgBookingValue),
            occupancyRate: Math.round(occupancyRate),
            upcomingCheckIns
        };

        return stats;
    } catch (error) {
        console.error('Error fetching booking stats:', error);
        throw error;
    }
};
