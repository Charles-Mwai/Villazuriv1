import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './BookingModal.css';

import CustomCalendar from './CustomCalendar';
import { calculateTotalCost, validateBookingDates } from '../utils/bookingLogic';
import { checkAvailability, createBooking, getAllPricingRules } from '../services/bookingService';

const BookingModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const [pricingRules, setPricingRules] = useState([]);
    const [formData, setFormData] = useState({
        arrivalDate: '',
        nights: '',
        flexible: '',
        guests: '',
        name: '',
        email: '',
        phone: '',
        services: [],
        activities: []
    });

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const rules = await getAllPricingRules();
                setPricingRules(rules);
            } catch (err) {
                console.error("BookingModal failed to fetch pricing rules:", err);
            }
        };
        fetchRules();
    }, []);

    useEffect(() => {
        const updateCostAndValidate = async () => {
            if (formData.arrivalDate && formData.nights && formData.nights !== '30+') {
                const start = new Date(formData.arrivalDate);
                const nightsCount = parseInt(formData.nights);
                const end = new Date(start);
                end.setDate(start.getDate() + nightsCount);

                // Update Cost - Pass pricingRules to the utility
                const cost = calculateTotalCost(start, end, pricingRules);
                setTotalCost(cost);

                // Validate Availability
                try {
                    setIsValidating(true);
                    setError('');
                    const { available } = await checkAvailability(
                        start.toISOString().split('T')[0],
                        end.toISOString().split('T')[0]
                    );
                    setIsAvailable(available);
                    if (!available) {
                        setError("Sorry, these dates are not available. Please select different dates.");
                    }
                } catch (err) {
                    console.error("Availability check failed:", err);
                    setIsAvailable(false);
                    setError("Unable to verify availability at this time. Please try again later.");
                } finally {
                    setIsValidating(false);
                }
            } else {
                setTotalCost(0);
                setIsAvailable(true);
                setError('');
            }
        };

        updateCostAndValidate();
    }, [formData.arrivalDate, formData.nights, pricingRules]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.arrivalDate || !formData.nights || !formData.phone || !formData.email) {
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

            try {
                setSubmitting(true);

                // Re-verify availability one last time before creating
                const { available } = await checkAvailability(
                    start.toISOString().split('T')[0],
                    end.toISOString().split('T')[0]
                );

                if (!available) {
                    setError("Sorry, these dates are no longer available. Please select different dates.");
                    setSubmitting(false);
                    return;
                }

                // Create booking in database
                const bookingData = {
                    checkIn: start.toISOString().split('T')[0],
                    checkOut: end.toISOString().split('T')[0],
                    nights: nights,
                    guests: parseInt(formData.guests) || 1,
                    guestName: formData.name || 'Guest',
                    guestEmail: formData.email,
                    guestPhone: formData.phone,
                    datesFlexible: formData.flexible === 'yes',
                    totalCost: totalCost,
                    services: formData.services,
                    activities: formData.activities
                };

                const createdBooking = await createBooking(bookingData);

                console.log('Booking processed:', createdBooking);

                // Navigate to checkout with booking details
                navigate('/checkout', {
                    state: {
                        booking: {
                            ...createdBooking,
                            services: formData.services,
                            activities: formData.activities
                        },
                        totalCost: totalCost
                    }
                });

                onClose();
            } catch (error) {
                console.error('Booking error:', error);
                setError("Failed to create booking. Please try again or contact us directly.");
            } finally {
                setSubmitting(false);
            }
        } else {
            setError("For stays of 30+ nights, please contact us directly.");
        }
    };

    const handleFlexibleChange = (value) => {
        setFormData(prev => ({
            ...prev,
            flexible: prev.flexible === value ? '' : value
        }));
    };

    const toggleSelection = (type, item) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].includes(item)
                ? prev[type].filter(i => i !== item)
                : [...prev[type], item]
        }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.arrivalDate || !formData.nights || !formData.phone || !formData.email) {
            setError("Please fill in all required fields");
            return;
        }

        if (!isAvailable) {
            setError("Selected dates are not available.");
            return;
        }

        setStep(2);
    };

    return (
        <div className="booking-modal-overlay">
            <div className="booking-modal-content">
                <div className="modal-header-banner" style={{ backgroundColor: '#264D52', padding: '60px 20px 40px' }}>
                    <button className="modal-close-icon" onClick={onClose}>
                        <X size={32} strokeWidth={1} />
                    </button>
                    <div className="header-text-container">
                        <h2 className="modal-title text-white" style={{ color: '#FFFFFF' }}>Travel Enquiry</h2>
                        <p className="modal-subtitle" style={{ color: '#FFFFFF' }}>Book your stay with us</p>
                    </div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleNextStep} className="booking-form">
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
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <ChevronDown className="custom-select-icon" size={20} strokeWidth={1.5} />
                                </div>
                                {calendarOpen && (
                                    <CustomCalendar
                                        selectedDate={formData.arrivalDate}
                                        nights={formData.nights}
                                        onDateSelect={(date) => {
                                            setFormData(prev => ({ ...prev, arrivalDate: date }));
                                        }}
                                        onClose={() => setCalendarOpen(false)}
                                    />
                                )}
                            </div>

                            <div className="form-group half-width">
                                <label htmlFor="nights">How Many Nights?*</label>
                                <div className="custom-select-wrapper">
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
                                    <ChevronDown className="custom-select-icon" size={20} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="guests">Number of People</label>
                                <div className="custom-select-wrapper">
                                    <select
                                        id="guests"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className={`underlined-input ${!formData.guests ? 'is-placeholder' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <option value="" disabled>Please select</option>
                                        {Array.from({ length: 6 }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="custom-select-icon" size={20} strokeWidth={1.5} />
                                </div>
                            </div>

                            <div className="form-group half-width">
                                <label>Are your dates flexible?*</label>
                                <div className="checkbox-group">
                                    <div className="checkbox-option" onClick={(e) => { e.preventDefault(); handleFlexibleChange('yes'); }}>
                                        <div className={`custom-checkbox ${formData.flexible === 'yes' ? 'checked' : ''}`}>
                                            {formData.flexible === 'yes' && <div className="checkmark"></div>}
                                        </div>
                                        <span>Yes</span>
                                    </div>
                                    <div className="checkbox-option" onClick={(e) => { e.preventDefault(); handleFlexibleChange('no'); }}>
                                        <div className={`custom-checkbox ${formData.flexible === 'no' ? 'checked' : ''}`}>
                                            {formData.flexible === 'no' && <div className="checkmark"></div>}
                                        </div>
                                        <span>No</span>
                                    </div>
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
                            />
                        </div>

                        {totalCost > 0 && (
                            <div className="total-cost-display">
                                <span>Total:</span>
                                <span className="cost-amount">${totalCost.toLocaleString()}</span>
                            </div>
                        )}

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-booking-btn"
                                disabled={isValidating || !isAvailable}
                            >
                                {isValidating ? 'CHECKING...' : 'CONTINUE'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="booking-form">
                        <p className="step-instruction-text">
                            would you like us to organise the following extra services? Prices will be shared after confirmation.
                        </p>
                        <div className="checklist-container">
                            <div className="checklist-section">
                                <h3 className="checklist-group-title">Services</h3>
                                <div className="checklist-grid">
                                    {['Chef', 'Concierge', 'Airport Pickup', 'Driver', 'Turndown Service'].map(service => (
                                        <label key={service} className="checkbox-option" onClick={(e) => { e.preventDefault(); toggleSelection('services', service); }}>
                                            <div className={`custom-checkbox ${formData.services.includes(service) ? 'checked' : ''}`}>
                                                {formData.services.includes(service) && <div className="checkmark"></div>}
                                            </div>
                                            <span>{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="checklist-section">
                                <h3 className="checklist-group-title">Activities</h3>
                                <div className="checklist-grid">
                                    {['Dolphin Watching', 'Dhow Cruise', 'Beach Dining', 'Marine Park'].map(activity => (
                                        <label key={activity} className="checkbox-option" onClick={(e) => { e.preventDefault(); toggleSelection('activities', activity); }}>
                                            <div className={`custom-checkbox ${formData.activities.includes(activity) ? 'checked' : ''}`}>
                                                {formData.activities.includes(activity) && <div className="checkmark"></div>}
                                            </div>
                                            <span>{activity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-actions multi-step-footer">
                            <button
                                type="button"
                                className="back-btn"
                                onClick={() => setStep(1)}
                            >
                                BACK
                            </button>
                            <button
                                type="submit"
                                className="submit-booking-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'PROCESSING...' : 'CONTINUE'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
