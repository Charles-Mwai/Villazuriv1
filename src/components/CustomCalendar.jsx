import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { getAllBookedDates } from '../services/bookingService';
import './CustomCalendar.css';

const CustomCalendar = ({ selectedDate, onDateSelect, onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookedDates, setBookedDates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedDate) {
            setCurrentDate(new Date(selectedDate));
        }
    }, [selectedDate]);

    // Fetch booked dates from Supabase
    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                setLoading(true);
                const dates = await getAllBookedDates();
                setBookedDates(dates);
            } catch (error) {
                console.error('Failed to fetch booked dates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookedDates();
    }, []);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        // Adjust for Monday start if needed, but screenshot shows Mon start? 
        // Screenshot shows Mon Tue Wed Thu Fri Sat Sun.
        // JS getDay(): 0=Sun, 1=Mon...
        // So we need to shift.

        return { days, firstDay };
    };

    // Helper to shift Sunday (0) to index 6, Mon (1) to 0, etc.
    const getAdjustedFirstDay = (dayIndex) => {
        return dayIndex === 0 ? 6 : dayIndex - 1;
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const generateCalendarDays = () => {
        const { days, firstDay } = getDaysInMonth(currentDate);
        const adjustedFirstDay = getAdjustedFirstDay(firstDay);

        const calendarDays = [];

        // Previous month filler
        const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = 0; i < adjustedFirstDay; i++) {
            calendarDays.push({
                day: prevMonthDays - adjustedFirstDay + i + 1,
                type: 'prev',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - adjustedFirstDay + i + 1)
            });
        }

        // Current month
        for (let i = 1; i <= days; i++) {
            calendarDays.push({
                day: i,
                type: 'current',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
            });
        }

        // Next month filler
        const remainingCells = 42 - calendarDays.length; // 6 rows * 7 cols
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push({
                day: i,
                type: 'next',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
            });
        }

        return calendarDays;
    };

    const handlePrevMonth = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isDateBooked = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return bookedDates.includes(dateStr);
    };

    const handleDateClick = (dayObj) => {
        // Don't allow selection of booked dates
        if (isDateBooked(dayObj.date)) {
            return;
        }

        // Format to YYYY-MM-DD for consistency with input type="date"
        const offsetDate = new Date(dayObj.date.getTime() - (dayObj.date.getTimezoneOffset() * 60000));
        const formattedDate = offsetDate.toISOString().split('T')[0];
        onDateSelect(formattedDate);
        onClose();
    };

    const isSelected = (date) => {
        if (!selectedDate) return false;
        const sel = new Date(selectedDate);
        return date.getDate() === sel.getDate() &&
            date.getMonth() === sel.getMonth() &&
            date.getFullYear() === sel.getFullYear();
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="custom-calendar-container" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-header">
                <button className="nav-btn" onClick={handlePrevMonth}>
                    <ChevronLeft size={20} color="#555" />
                </button>

                <div className="month-year-display">
                    <span className="month-label">
                        {months[currentDate.getMonth()]} <ChevronDown size={14} className="dropdown-chevron" />
                    </span>
                    <span className="year-label">
                        {currentDate.getFullYear()} <ChevronDown size={14} className="dropdown-chevron" />
                    </span>
                </div>

                <button className="nav-btn" onClick={handleNextMonth}>
                    <ChevronRight size={20} color="#555" />
                </button>
            </div>

            <div className="calendar-days-header">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="day-name">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {generateCalendarDays().map((dayObj, index) => {
                    const isBooked = isDateBooked(dayObj.date);
                    return (
                        <div
                            key={index}
                            className={`calendar-cell ${dayObj.type} 
                                       ${isSelected(dayObj.date) ? 'selected' : ''} 
                                       ${isToday(dayObj.date) ? 'today' : ''}
                                       ${isBooked ? 'booked' : ''}`}
                            onClick={() => !isBooked && handleDateClick(dayObj)}
                            style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
                        >
                            <span>{dayObj.day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomCalendar;
