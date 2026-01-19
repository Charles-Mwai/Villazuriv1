import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="privacy-page">
            <Navbar />

            <section className="privacy-hero">
                <div className="privacy-hero-overlay"></div>
            </section>

            <section className="privacy-content-section section-padding">
                <div className="container">
                    <h1 className="privacy-page-title">Privacy Policy</h1>
                    <RevealOnScroll>
                        <div className="privacy-text-container">
                            <div className="privacy-block">
                                <h3>1. Introduction</h3>
                                <p>Villa Zuri ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website and use our booking services.</p>
                            </div>

                            <div className="privacy-block">
                                <h3>2. Information We Collect</h3>
                                <p>We collect information that you provide directly to us when you make an enquiry or a booking, including:</p>
                                <ul>
                                    <li>Name and contact information (email, phone number).</li>
                                    <li>Booking details (dates, number of guests, special requests).</li>
                                    <li>Payment information (processed securely through our payment providers).</li>
                                </ul>
                            </div>

                            <div className="privacy-block">
                                <h3>3. How We Use Your Information</h3>
                                <p>We use the information we collect to:</p>
                                <ul>
                                    <li>Process and confirm your bookings.</li>
                                    <li>Communicate with you regarding your stay.</li>
                                    <li>Improve our services and website user experience.</li>
                                    <li>Comply with legal and regulatory requirements.</li>
                                </ul>
                            </div>

                            <div className="privacy-block">
                                <h3>4. Data Security</h3>
                                <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. However, no method of transmission over the internet is 100% secure.</p>
                            </div>

                            <div className="privacy-block">
                                <h3>5. Cookies</h3>
                                <p>Our website uses cookies to enhance your browsing experience. Cookies are small files stored on your device that help us analyze web traffic and remember your preferences. You can choose to accept or decline cookies through your browser settings.</p>
                            </div>

                            <div className="privacy-block">
                                <h3>6. Your Rights</h3>
                                <p>Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at info@villazuri.com.</p>
                            </div>

                            <div className="privacy-block">
                                <h3>7. Changes to This Policy</h3>
                                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
                            </div>

                            <div className="privacy-block">
                                <h3>8. Contact Us</h3>
                                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                                <p>Email: info@villazuri.com</p>
                                <p>Villa Zuri, Watamu, Kenya</p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
