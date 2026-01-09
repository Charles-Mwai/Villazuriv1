import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingStats, getAllBookings, deleteBooking } from '../../services/adminService';
import { Calendar, DollarSign, TrendingUp, Clock, Users, CheckCircle, Trash2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, bookingsData] = await Promise.all([
                    getBookingStats(),
                    getAllBookings({ status: 'all' })
                ]);
                setStats(statsData);
                setRecentBookings(bookingsData.slice(0, 5)); // Get 5 most recent
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDateRange = (checkIn, checkOut) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const start = new Date(checkIn).toLocaleDateString('en-US', options);
        const end = new Date(checkOut).toLocaleDateString('en-US', options);
        return `${start} - ${end}`;
    };

    const handleDeleteBooking = async (bookingId, guestName, e) => {
        e.stopPropagation(); // Prevent navigation to booking detail

        if (window.confirm(`Are you sure you want to delete the booking for ${guestName}? This action cannot be undone.`)) {
            try {
                await deleteBooking(bookingId);

                // Refresh data after deletion
                const [statsData, bookingsData] = await Promise.all([
                    getBookingStats(),
                    getAllBookings({ status: 'all' })
                ]);
                setStats(statsData);
                setRecentBookings(bookingsData.slice(0, 5));

                alert('Booking deleted successfully');
            } catch (error) {
                console.error('Failed to delete booking:', error);
                alert('Failed to delete booking. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Villa Zuri Management</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card stat-revenue">
                    <div className="stat-content">
                        <p className="stat-label">Total Revenue</p>
                        <p className="stat-value">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
                        <p className="stat-sub">From paid bookings</p>
                    </div>
                    <div className="stat-icon">
                        <DollarSign size={28} />
                    </div>
                </div>

                <div className="stat-card stat-occupancy">
                    <div className="stat-content">
                        <p className="stat-label">Occupancy Rate</p>
                        <p className="stat-value">{stats?.occupancyRate || '0'}%</p>
                        <p className="stat-sub">Next 30 days</p>
                    </div>
                    <div className="stat-icon">
                        <TrendingUp size={28} />
                    </div>
                </div>

                <div className="stat-card stat-confirmed">
                    <div className="stat-content">
                        <p className="stat-label">Confirmed Bookings</p>
                        <p className="stat-value">{stats?.confirmed + stats?.paid || '0'}</p>
                        <p className="stat-sub">Active reservations</p>
                    </div>
                    <div className="stat-icon">
                        <CheckCircle size={28} />
                    </div>
                </div>

                <div className="stat-card stat-pending">
                    <div className="stat-content">
                        <p className="stat-label">Pending Inquiries</p>
                        <p className="stat-value">{stats?.pending || '0'}</p>
                        <p className="stat-sub">Awaiting confirmation</p>
                    </div>
                    <div className="stat-icon">
                        <Clock size={28} />
                    </div>
                </div>

                <div className="stat-card stat-upcoming">
                    <div className="stat-content">
                        <p className="stat-label">Upcoming Check-ins</p>
                        <p className="stat-value">{stats?.upcomingCheckIns || '0'}</p>
                        <p className="stat-sub">Next 7 days</p>
                    </div>
                    <div className="stat-icon">
                        <Calendar size={28} />
                    </div>
                </div>

                <div className="stat-card stat-average">
                    <div className="stat-content">
                        <p className="stat-label">Avg Booking Value</p>
                        <p className="stat-value">${stats?.avgBookingValue?.toLocaleString() || '0'}</p>
                        <p className="stat-sub">Per reservation</p>
                    </div>
                    <div className="stat-icon">
                        <Users size={28} />
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Recent Bookings</h2>
                    <button
                        onClick={() => navigate('/admin/bookings')}
                        className="view-all-btn"
                    >
                        View All
                    </button>
                </div>

                {recentBookings.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={48} className="empty-icon" />
                        <p>No bookings yet</p>
                        <span className="empty-subtitle">Bookings will appear here once guests make reservations</span>
                    </div>
                ) : (
                    <div className="recent-bookings-list">
                        {recentBookings.map(booking => (
                            <div
                                key={booking.id}
                                className="booking-card"
                                onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                            >
                                <div className="booking-card-header">
                                    <h3>{booking.guest_name}</h3>
                                    <div className="booking-card-actions">
                                        <span className={`status-badge status-${booking.status}`}>
                                            {booking.status}
                                        </span>
                                        <button
                                            className="delete-booking-btn"
                                            onClick={(e) => handleDeleteBooking(booking.id, booking.guest_name, e)}
                                            title="Delete booking"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="booking-card-details">
                                    <div className="booking-info">
                                        <p className="booking-dates">{formatDateRange(booking.check_in, booking.check_out)}</p>
                                        <p className="booking-meta">
                                            {booking.nights} {booking.nights === 1 ? 'night' : 'nights'} · {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                                        </p>
                                    </div>
                                    <p className="booking-cost">${booking.total_cost.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
