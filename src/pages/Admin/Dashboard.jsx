import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingStats, getAllBookings } from '../../services/adminService';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';
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

    if (loading) {
        return <div className="loading-state">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome to the VillaZuri admin panel</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card stat-pink">
                    <div className="stat-content">
                        <p className="stat-label">DAILY VISITS</p>
                        <p className="stat-value">8,652</p>
                        <p className="stat-sub">2.97% Since last month</p>
                    </div>
                    <div className="stat-icon">
                        <Calendar size={32} />
                    </div>
                </div>

                <div className="stat-card stat-purple">
                    <div className="stat-content">
                        <p className="stat-label">REVENUE</p>
                        <p className="stat-value">${stats?.totalRevenue?.toLocaleString() || '9,254.62'}</p>
                        <p className="stat-sub">18.25% Since last month</p>
                    </div>
                    <div className="stat-icon">
                        <DollarSign size={32} />
                    </div>
                </div>

                <div className="stat-card stat-blue">
                    <div className="stat-content">
                        <p className="stat-label">ORDERS</p>
                        <p className="stat-value">{stats?.total || '753'}</p>
                        <p className="stat-sub">-5.75% Since last month</p>
                    </div>
                    <div className="stat-icon">
                        <List size={32} />
                    </div>
                </div>

                <div className="stat-card stat-cyan">
                    <div className="stat-content">
                        <p className="stat-label">USERS</p>
                        <p className="stat-value">63,154</p>
                        <p className="stat-sub">8.21% Since last month</p>
                    </div>
                    <div className="stat-icon">
                        <Users size={32} />
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
                        <p>No bookings yet</p>
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
                                    <span className={`status-badge status-${booking.status}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="booking-card-details">
                                    <p>{new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}</p>
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
