import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, ShieldCheck, Loader } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Checkout.css';
import { getBookingById } from '../../services/bookingService';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [bookingData, setBookingData] = useState(location.state?.booking);
    const [totalCost, setTotalCost] = useState(location.state?.totalCost);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        if (bookingData?.nights) {
            // Force recalculation based on the new $2/night rate
            // This ensures old bookings with high stored costs don't trigger payment limits
            const correctedTotal = bookingData.nights * 1;
            setTotalCost(correctedTotal);
        }
    }, [bookingData]);

    useEffect(() => {
        const recoverBooking = async () => {
            const stateBookingId = location.state?.bookingId;

            if (!bookingData && stateBookingId) {
                try {
                    setIsLoading(true);
                    const recovered = await getBookingById(stateBookingId);
                    if (recovered) {
                        setBookingData(recovered);
                        setTotalCost(recovered.total_cost);
                    } else {
                        setFetchError(true);
                    }
                } catch (err) {
                    console.error('Failed to recover booking:', err);
                    setFetchError(true);
                } finally {
                    setIsLoading(false);
                }
            } else if (!bookingData && !stateBookingId) {
                navigate('/');
            }
        };

        recoverBooking();
    }, [bookingData, location.state, navigate]);

    const handlePesapalPayment = async () => {
        setIsRedirecting(true);
        try {
            // Prepare billing details
            const firstName = bookingData.guest_name ? bookingData.guest_name.split(' ')[0] : 'Guest';
            const lastName = bookingData.guest_name && bookingData.guest_name.includes(' ')
                ? bookingData.guest_name.split(' ').slice(1).join(' ')
                : 'User';

            // Force calc cost to avoid state issues
            const finalAmount = bookingData.nights * 1;

            const response = await fetch('/api/pesapal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalAmount,
                    email: bookingData.guest_email,
                    phoneNumber: bookingData.guest_phone,
                    firstName: firstName,
                    lastName: lastName,
                    reference: bookingData.id,
                    description: `Payment for Booking ${bookingData.id}`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Payment initialization failed');
            }

            const { redirectUrl } = await response.json();

            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                throw new Error('No redirect URL received from payment provider');
            }

        } catch (error) {
            console.error('Payment Error:', error);
            setIsRedirecting(false);
            alert(`Payment initialization failed: ${error.message}`);
        }
    };

    if (isLoading) {
        return (
            <div className="checkout-page">
                <Navbar />
                <div className="checkout-container container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div className="loader-container">
                        <Loader size={48} className="spinner-icon" color="#264D52" />
                        <p style={{ marginTop: '20px', color: '#666' }}>Loading your booking details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (fetchError) {
        navigate('/');
        return null;
    }

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
                                <button
                                    onClick={handlePesapalPayment}
                                    className="pay-now-btn"
                                    disabled={isRedirecting}
                                >
                                    {isRedirecting ? (
                                        <>
                                            <Loader size={18} className="spinner-icon" style={{ marginRight: '10px' }} />
                                            Redirecting...
                                        </>
                                    ) : 'Pay'}
                                </button>
                            </div>

                            <div className="security-assurance">
                                <ShieldCheck size={20} color="#264D52" />
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
