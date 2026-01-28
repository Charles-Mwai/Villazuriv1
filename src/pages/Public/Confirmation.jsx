import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Checkout.css'; // Reuse checkout styles
import { getBookingById } from '../../services/bookingService';
import { sendBookingConfirmation } from '../../services/emailService';

const Confirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [bookingId, setBookingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const trackingId = searchParams.get('OrderTrackingId') || searchParams.get('pesapal_transaction_tracking_id');
    const merchantRef = searchParams.get('OrderReference') || searchParams.get('pesapal_merchant_reference') || searchParams.get('bookingId');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!merchantRef || !trackingId) {
                // If we don't have tracking info, we can't verify
                if (!merchantRef) navigate('/');
                else setStatus('failed');
                return;
            }

            setBookingId(merchantRef);
            setStatus('verifying');
            setIsLoading(true);

            try {
                // Call the secure server-side verification API
                const response = await fetch(`/api/pesapal/verify-payment?trackingId=${trackingId}&merchantRef=${merchantRef}`);
                const result = await response.json();

                if (result.success && result.status === 'Completed') {
                    setStatus('success');
                } else if (result.status === 'Pending') {
                    setStatus('pending');
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Payment verification failed:', error);
                setStatus('failed');
            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [trackingId, merchantRef, navigate]);

    return (
        <div className="checkout-page">
            <Navbar />
            <div className="checkout-container container">
                <div className="success-message-wrapper">
                    <div className="success-message">
                        {status === 'verifying' && (
                            <div className="status-verifying">
                                <div className="loader-container">
                                    <Loader size={48} className="spinner-icon" color="#0A4D2A" />
                                </div>
                                <h1>Verifying Payment</h1>
                                <p>We are confirming your transaction with Pesapal. This usually takes just a few seconds. Please stay on this page.</p>
                            </div>
                        )}

                        {status === 'pending' && (
                            <div className="status-pending">
                                <div className="loader-container">
                                    <Loader size={48} className="spinner-icon" color="#D4AF37" />
                                </div>
                                <h1>Payment Processing</h1>
                                <p>Your payment is currently being processed by Pesapal. We will update your booking status once confirmation is received.</p>
                                <button className="return-home-btn" onClick={() => navigate('/')}>
                                    Return to Home <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="status-success">
                                <div className="icon-circle">
                                    <CheckCircle size={64} color="#0A4D2A" />
                                </div>
                                <h1>Booking Confirmed</h1>
                                <p>Thank you for choosing <strong>Villa Zuri</strong>. Your payment has been received and your reservation is now secured.</p>
                                <p className="follow-up-note">A detailed confirmation email has been sent to your inbox.</p>

                                {bookingId && (
                                    <div className="booking-ref-box">
                                        <span className="ref-label">Booking Reference</span>
                                        <span className="ref-value">#{bookingId.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                )}

                                <button className="return-home-btn" onClick={() => navigate('/')}>
                                    Return to Home <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="status-failed">
                                <XCircle size={64} color="#C53030" />
                                <h1>Payment Unsuccessful</h1>
                                <p>We were unable to process your payment. If you have been charged, please contact our support team with your reference.</p>
                                <button className="return-home-btn secondary" onClick={() => navigate('/checkout', { state: { bookingId } })}>
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Confirmation;
