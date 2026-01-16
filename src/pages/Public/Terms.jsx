import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import './Terms.css';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="terms-page">
            <Navbar />

            <section className="terms-hero">
                <div className="terms-hero-overlay"></div>
            </section>

            <section className="terms-content-section section-padding">
                <div className="container">
                    <h1 className="terms-page-title">Terms & Conditions</h1>
                    <RevealOnScroll>
                        <div className="terms-text-container">
                            <div className="terms-block">
                                <h3>1. Payment</h3>
                                <p>A 25% non-refundable deposit is required to confirm your booking.</p>
                                <p>The remaining balance is due 60 days before arrival.</p>
                                <p>Unpaid balances by the due date may result in cancellation and loss of the deposit.</p>
                            </div>

                            <div className="terms-block">
                                <h3>2. Cancellations</h3>
                                <p>All cancellations must be made in writing.</p>
                                <p>Deposits are non-refundable.</p>
                                <p>Cancellations 60–31 days before arrival incur a 50% charge of the total stay.</p>
                                <p>Cancellations within 30 days of arrival incur a 100% charge.</p>
                                <p>We strongly recommend travel insurance to cover unexpected changes.</p>
                            </div>

                            <div className="terms-block">
                                <h3>3. Rates</h3>
                                <p>Rates may be adjusted if government taxes, levies, or service charges change.</p>
                                <p>Any changes to rates or terms will be communicated with at least one month’s notice.</p>
                            </div>

                            <div className="terms-block">
                                <h3>4. Liability</h3>
                                <p>Guests stay at Villa Zuri at their own risk.</p>
                                <p>Villa Zuri is not responsible for any illness, injury, accident, loss, or damage during your stay or while travelling to or from the property.</p>
                                <p>Personal belongings remain the responsibility of the guest.</p>
                            </div>

                            <div className="terms-block">
                                <h3>5. Complaints & Disputes</h3>
                                <p>Please raise any concerns with management before departure, so we can assist promptly.</p>
                                <p>If needed, concerns must be submitted in writing within 14 days after departure.</p>
                                <p>All disputes are governed by Kenyan law.</p>
                            </div>

                            <div className="terms-block">
                                <h3>6. House Rules</h3>
                                <p>To ensure a relaxed and enjoyable stay, we kindly ask that guests observe the following:</p>
                                <ul>
                                    <li>Check-in and check-out details will be shared before arrival; early or late requests are subject to availability.</li>
                                    <li>Only registered guests may stay at the villa unless approved in advance.</li>
                                    <li>Please keep noise levels respectful, especially at night and early morning.</li>
                                    <li>Treat the villa with care; any damage or loss may be charged.</li>
                                    <li>No smoking indoors. Outdoor smoking is permitted in designated areas only.</li>
                                    <li>Pets are not allowed unless approved in advance.</li>
                                    <li>Children must be supervised at all times, especially around the pool.</li>
                                    <li>Illegal or disruptive behavior is not permitted.</li>
                                    <li>Please secure the property and do not share keys or access details.</li>
                                </ul>
                                <p>Villa Zuri reserves the right to end a stay without refund if these terms or house rules are not respected.</p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Terms;
