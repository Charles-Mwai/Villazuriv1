import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';
import './BookingModal.css';

import CustomCalendar from './CustomCalendar';
import { calculateTotalCost, validateBookingDates } from '../utils/bookingLogic';

const BookingModal = ({ isOpen, onClose }) => {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        arrivalDate: '',
        nights: '',
        flexible: '',
        guests: '',
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (formData.arrivalDate && formData.nights && formData.nights !== '30+') {
            const start = new Date(formData.arrivalDate);
            const nights = parseInt(formData.nights);
            const end = new Date(start);
            end.setDate(start.getDate() + nights);

            const cost = calculateTotalCost(start, end);
            setTotalCost(cost);
        } else {
            setTotalCost(0);
        }
    }, [formData.arrivalDate, formData.nights]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.arrivalDate || !formData.nights) {
            setError("Please fill in all required fields");
            return;
        }

        // Logic validation
        if (formData.nights !== '30+') {
            const start = new Date(formData.arrivalDate);
            const nights = parseInt(formData.nights);
            const end = new Date(start);
            end.setDate(start.getDate() + nights);

            const validation = validateBookingDates(start, end);
            if (!validation.isValid) {
                setError(validation.error);
                return;
            }
        }

        console.log('Booking Request:', { ...formData, totalCost });
        alert(`Thank you for your inquiry. Estimated Total: $${totalCost.toLocaleString()}`);
        onClose();
    };

    const handleFlexibleChange = (value) => {
        setFormData(prev => ({
            ...prev,
            flexible: prev.flexible === value ? '' : value
        }));
    };

    return (
        <div className="booking-modal-overlay">
            <div className="booking-modal-content">
                <div className="modal-header">
                    <button className="modal-close-icon" onClick={onClose}>
                        <X size={32} strokeWidth={1} />
                    </button>
                    <h2 className="modal-title">Traveller Enquiry</h2>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-row">
                        <div className="form-group half-width" style={{ position: 'relative' }}>
                            <label htmlFor="arrivalDate">When will you be arriving?*</label>
                            <div
                                className="custom-select-wrapper"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCalendarOpen(!calendarOpen);
                                }}
                            >
                                <input
                                    type="text"
                                    id="arrivalDate"
                                    name="arrivalDate"
                                    readOnly
                                    required
                                    value={formData.arrivalDate}
                                    className={`underlined-input ${!formData.arrivalDate ? 'is-placeholder' : ''}`}
                                    placeholder="Please select"
                                    style={{ cursor: 'pointer' }}
                                />
                                <ChevronDown className="custom-select-icon" size={20} strokeWidth={1.5} />
                            </div>
                            {calendarOpen && (
                                <CustomCalendar
                                    selectedDate={formData.arrivalDate}
                                    onDateSelect={(date) => {
                                        setFormData(prev => ({ ...prev, arrivalDate: date }));
                                    }}
                                    onClose={() => setCalendarOpen(false)}
                                />
                            )}
                        </div>

                        <div className="form-group half-width">
                            <label htmlFor="nights">How Many Nights?*</label>
                            <select
                                id="nights"
                                name="nights"
                                required
                                value={formData.nights}
                                onChange={handleChange}
                                className={`underlined-input ${!formData.nights ? 'is-placeholder' : ''}`}
                            >
                                <option value="" disabled>Please select</option>
                                {Array.from({ length: 28 }, (_, i) => i + 3).map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                                <option value="30+">30+</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half-width">
                            <label htmlFor="guests">Number of People</label>
                            <select
                                id="guests"
                                name="guests"
                                value={formData.guests}
                                onChange={handleChange}
                                className={`underlined-input ${!formData.guests ? 'is-placeholder' : ''}`}
                            >
                                <option value="" disabled>Please select</option>
                                {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group half-width">
                            <label>Are your dates flexible?*</label>
                            <div className="checkbox-group">
                                <label className="checkbox-option">
                                    <div
                                        className={`custom-checkbox ${formData.flexible === 'yes' ? 'checked' : ''}`}
                                        onClick={() => handleFlexibleChange('yes')}
                                    >
                                        {formData.flexible === 'yes' && <div className="checkmark"></div>}
                                    </div>
                                    <span>Yes</span>
                                </label>
                                <label className="checkbox-option">
                                    <div
                                        className={`custom-checkbox ${formData.flexible === 'no' ? 'checked' : ''}`}
                                        onClick={() => handleFlexibleChange('no')}
                                    >
                                        {formData.flexible === 'no' && <div className="checkmark"></div>}
                                    </div>
                                    <span>No</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half-width">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="underlined-input"
                                placeholder=" "
                            />
                        </div>
                        <div className="form-group half-width">
                            <label htmlFor="phone">Phone number*</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="underlined-input"
                                placeholder=" "
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email address*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="underlined-input"
                            placeholder=" "
                        />
                    </div>

                    {totalCost > 0 && (
                        <div className="total-cost-display">
                            <span>Estimated Total:</span>
                            <span className="cost-amount">${totalCost.toLocaleString()}</span>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="submit" className="submit-booking-btn">
                            CONTINUE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
