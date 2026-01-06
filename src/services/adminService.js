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
 * Get booking statistics
 * @returns {Promise<Object>}
 */
export const getBookingStats = async () => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('status, total_cost');

        if (error) throw error;

        const stats = {
            total: data.length,
            pending: data.filter(b => b.status === 'pending').length,
            confirmed: data.filter(b => b.status === 'confirmed').length,
            paid: data.filter(b => b.status === 'paid').length,
            cancelled: data.filter(b => b.status === 'cancelled').length,
            totalRevenue: data
                .filter(b => b.status === 'paid')
                .reduce((sum, b) => sum + parseFloat(b.total_cost), 0)
        };

        return stats;
    } catch (error) {
        console.error('Error fetching booking stats:', error);
        throw error;
    }
};
