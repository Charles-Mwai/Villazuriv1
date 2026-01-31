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

    const handlePesapalPayment = () => {
        setIsRedirecting(true);
        // Redirecting directly to the PesaPal Store as requested
        // This provides a reliable, pre-configured payment page
        const paymentUrl = new URL("https://store.pesapal.com/villazuri");
        if (totalCost) {
            paymentUrl.searchParams.append("amount", totalCost);
        }
        if (bookingData?.id) {
            paymentUrl.searchParams.append("reference", bookingData.id);
        }
        window.location.href = paymentUrl.toString();
    };

    if (isLoading) {
        return (
            <div className="checkout-page">
                <Navbar />
                <div className="checkout-container container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div className="loader-container">
                        <Loader size={48} className="spinner-icon" color="#0A4D2A" />
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
