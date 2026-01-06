import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings } from '../../services/adminService';
import StatusBadge from '../../components/Admin/StatusBadge';
import './BookingsList.css';

const BookingsList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ status: 'all', search: '' });
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAllBookings(filters);
            setBookings(data);
        } catch (err) {
            setError('Failed to load bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [filters]);

    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleStatusFilter = (status) => {
        setFilters(prev => ({ ...prev, status }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bookings-page">
            <div className="page-header">
                <h1>Bookings Management</h1>
                <p>View and manage all villa reservations</p>
            </div>

            <div className="bookings-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={filters.search}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                <div className="status-filters">
                    {['all', 'pending', 'confirmed', 'paid', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            className={`filter-btn ${filters.status === status ? 'active' : ''}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {loading ? (
                <div className="loading-state">Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="empty-state">
                    <p>No bookings found</p>
                </div>
            ) : (
                <div className="bookings-table-container">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Guest Name</th>
                                <th>Email</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Nights</th>
                                <th>Guests</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr
                                    key={booking.id}
                                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                                    className="booking-row"
                                >
                                    <td className="guest-name">{booking.guest_name}</td>
                                    <td className="guest-email">{booking.guest_email}</td>
                                    <td>{formatDate(booking.check_in)}</td>
                                    <td>{formatDate(booking.check_out)}</td>
                                    <td>{booking.nights}</td>
                                    <td>{booking.guests}</td>
                                    <td className="total-cost">${booking.total_cost.toLocaleString()}</td>
                                    <td>
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="created-date">{formatDate(booking.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="bookings-footer">
                <p>Total bookings: {bookings.length}</p>
            </div>
        </div>
    );
};

export default BookingsList;
