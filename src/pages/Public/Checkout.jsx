import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Dummy state for payment form
    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const bookingData = location.state?.booking;
    const totalCost = location.state?.totalCost;

    useEffect(() => {
        if (!bookingData) {
            navigate('/');
        }
    }, [bookingData, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing delay
        setTimeout(() => {
            setProcessing(false);
            setCompleted(true);
        }, 2000);
    };

    if (!bookingData) return null;

    if (completed) {
        return (
            <div className="checkout-page">
                <Navbar />
                <div className="checkout-container container">
                    <div className="success-message">
                        <CheckCircle size={64} color="#4CAF50" />
                        <h1>Booking Confirmed!</h1>
                        <p>Thank you, {bookingData.guest_name}. Your reservation has been secured.</p>
                        <p className="order-id">Booking ID: #{bookingData.id.slice(0, 8)}</p>
                        <button className="return-home-btn" onClick={() => navigate('/')}>Return to Home</button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <Navbar />
            <div className="checkout-container container">
                <div className="checkout-grid">
                    {/* Booking Summary */}
                    <div className="booking-summary-panel">
                        <h2>Reservation Summary</h2>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Check-in</span>
                                <strong>{new Date(bookingData.check_in).toLocaleDateString()}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Check-out</span>
                                <strong>{new Date(bookingData.check_out).toLocaleDateString()}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Guests</span>
                                <strong>{bookingData.guests} Adults</strong>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total to Pay</span>
                                <strong>${totalCost?.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="payment-form-panel">
                        <div className="panel-header">
                            <h2>Secure Payment</h2>
                            <div className="secure-badge">
                                <Lock size={16} />
                                <span>SSL Encrypted</span>
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="payment-form">
                            <div className="form-group">
                                <label>Name on Card</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    required
                                    placeholder="J. Smith"
                                    value={paymentData.cardName}
                                    onChange={handleInputChange}
                                    className="checkout-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Card Number</label>
                                <div className="card-input-wrapper">
                                    <CreditCard className="card-icon" size={20} />
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        required
                                        placeholder="0000 0000 0000 0000"
                                        value={paymentData.cardNumber}
                                        onChange={handleInputChange}
                                        className="checkout-input with-icon"
                                        maxLength={19}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Expiry Date</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        required
                                        placeholder="MM/YY"
                                        className="checkout-input"
                                        maxLength={5}
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        required
                                        placeholder="123"
                                        className="checkout-input"
                                        maxLength={3}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="pay-now-btn" disabled={processing}>
                                {processing ? 'Processing...' : `Pay $${totalCost?.toLocaleString()}`}
                            </button>

                            <p className="payment-dummy-note">This is a secure dummy checkout. No real charge will be made.</p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
