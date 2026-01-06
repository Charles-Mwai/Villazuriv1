import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings } from '../../services/adminService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarView.css';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings({ status: 'all' });
            setBookings(data.filter(b => b.status !== 'cancelled'));
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return firstDay;
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Previous month days
        const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                type: 'prev',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                type: 'current',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                type: 'next',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
            });
        }

        return days;
    };

    const getBookingsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return bookings.filter(booking => {
            const checkIn = booking.check_in;
            const checkOut = booking.check_out;
            return dateStr >= checkIn && dateStr <= checkOut;
        });
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    if (loading) {
        return <div className="loading-state">Loading calendar...</div>;
    }

    return (
        <div className="calendar-view-page">
            <div className="calendar-header">
                <h1>Booking Calendar</h1>
                <p>View all reservations by month</p>
            </div>

            <div className="calendar-controls">
                <button onClick={prevMonth} className="month-nav-btn">
                    <ChevronLeft size={20} />
                </button>
                <h2 className="current-month">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={nextMonth} className="month-nav-btn">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="calendar-container">
                <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="weekday-label">{day}</div>
                    ))}
                </div>

                <div className="calendar-days-grid">
                    {generateCalendarDays().map((dayObj, index) => {
                        const dayBookings = getBookingsForDate(dayObj.date);
                        const hasBookings = dayBookings.length > 0;

                        return (
                            <div
                                key={index}
                                className={`calendar-day ${dayObj.type} ${hasBookings ? 'has-bookings' : ''}`}
                            >
                                <span className="day-number">{dayObj.day}</span>
                                {hasBookings && (
                                    <div className="bookings-indicator">
                                        {dayBookings.map(booking => (
                                            <div
                                                key={booking.id}
                                                className={`booking-dot status-${booking.status}`}
                                                onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                                                title={`${booking.guest_name} - ${booking.status}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="calendar-legend">
                <h3>Status Legend</h3>
                <div className="legend-items">
                    <div className="legend-item">
                        <div className="legend-dot status-pending"></div>
                        <span>Pending</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot status-confirmed"></div>
                        <span>Confirmed</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot status-paid"></div>
                        <span>Paid</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
