import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, updateBookingStatus, deleteBooking } from '../../services/adminService';
import StatusBadge from '../../components/Admin/StatusBadge';
import { ArrowLeft, Trash2 } from 'lucide-react';
import './BookingDetail.css';

const BookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const data = await getBookingById(id);
            setBooking(data);
        } catch (err) {
            setError('Failed to load booking');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        if (!window.confirm(`Change status to "${newStatus}"?`)) return;

        try {
            setUpdating(true);
            const updated = await updateBookingStatus(id, newStatus);
            setBooking(updated);
            alert('Status updated successfully!');
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteBooking(id);
            alert('Booking deleted successfully');
            navigate('/admin/bookings');
        } catch (err) {
            alert('Failed to delete booking');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading-state">Loading booking...</div>;
    }

    if (error || !booking) {
        return (
            <div className="error-state">
                <p>{error || 'Booking not found'}</p>
                <button onClick={() => navigate('/admin/bookings')}>Back to Bookings</button>
            </div>
        );
    }

    return (
        <div className="booking-detail-page">
            <div className="detail-header">
                <button onClick={() => navigate('/admin/bookings')} className="back-button">
                    <ArrowLeft size={20} />
                    Back to Bookings
                </button>
                <h1>Booking Details</h1>
            </div>

            <div className="detail-content">
                <div className="detail-section">
                    <div className="section-header">
                        <h2>Guest Information</h2>
                        <StatusBadge status={booking.status} />
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Name</label>
                            <p>{booking.guest_name}</p>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <p>{booking.guest_email}</p>
                        </div>
                        <div className="info-item">
                            <label>Phone</label>
                            <p>{booking.guest_phone}</p>
                        </div>
                        <div className="info-item">
                            <label>Number of Guests</label>
                            <p>{booking.guests}</p>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h2>Booking Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Check-in</label>
                            <p className="highlight">{formatDate(booking.check_in)}</p>
                        </div>
                        <div className="info-item">
                            <label>Check-out</label>
                            <p className="highlight">{formatDate(booking.check_out)}</p>
                        </div>
                        <div className="info-item">
                            <label>Number of Nights</label>
                            <p>{booking.nights}</p>
                        </div>
                        <div className="info-item">
                            <label>Dates Flexible</label>
                            <p>{booking.dates_flexible ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="info-item">
                            <label>Total Cost</label>
                            <p className="total">${booking.total_cost.toLocaleString()}</p>
                        </div>
                        <div className="info-item">
                            <label>Booking ID</label>
                            <p className="booking-id">{booking.id}</p>
                        </div>
                        <div className="info-item">
                            <label>Created</label>
                            <p>{new Date(booking.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h2>Update Status</h2>
                    <div className="status-actions">
                        {['pending', 'confirmed', 'paid', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                disabled={booking.status === status || updating}
                                className={`status-btn ${booking.status === status ? 'current' : ''}`}
                            >
                                {booking.status === status ? `Current: ${status}` : `Set to ${status}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="detail-section danger-zone">
                    <h2>Danger Zone</h2>
                    <p>Be careful! This action cannot be undone.</p>
                    <button onClick={handleDelete} className="delete-btn">
                        <Trash2 size={18} />
                        Delete Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;
