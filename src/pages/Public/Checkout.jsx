import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state?.booking;
    const totalCost = location.state?.totalCost;

    useEffect(() => {
        if (!bookingData) {
            navigate('/');
        }
    }, [bookingData, navigate]);

    const handlePesapalPayment = () => {
        // Redirecting directly to the PesaPal Store as requested
        // This provides a reliable, pre-configured payment page
        window.location.href = "https://store.pesapal.com/villazuri";
    };

    if (!bookingData) return null;

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

                    {/* Pesapal CTA */}
                    <div className="payment-form-panel">
                        <div className="panel-header">
                            <h2>Payment Method</h2>
                            <div className="secure-badge">
                                <Lock size={16} />
                                <span>Secure Checkout</span>
                            </div>
                        </div>

                        <div className="pesapal-checkout-content">
                            <p className="payment-intro">
                                We use <strong>Pesapal</strong> to process your payment securely.
                                You can pay using Mobile Money (M-Pesa, Airtel Money), Visa, or Mastercard.
                            </p>

                            <div className="payment-methods-icons">
                                <img src="/pesapal-logos.png" alt="M-Pesa, Visa, Mastercard" className="payment-logos" />
                            </div>

                            <div className="payment-action-container">
                                <button onClick={handlePesapalPayment} className="pay-now-btn">
                                    Pay
                                </button>
                            </div>

                            <div className="security-assurance">
                                <ShieldCheck size={20} color="#0A4D2A" />
                                <span>Your payment is handled on Pesapal's secure servers. Villa Zuri does not store your card details.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
