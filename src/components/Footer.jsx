import React from 'react';
import { Instagram, Facebook, Linkedin, Twitter, Music2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer">
            <div className="container footer-container">
                {/* Top Section */}
                <div className="footer-top">
                    <div className="footer-brand-section">
                        <img src="/Artboard 1@2x.png" alt="Villa Zuri Logo" className="footer-logo-main" />
                    </div>

                    <div className="footer-links-grid">
                        <div className="footer-links-col">
                            <ul>
                                <li><a href="/terms">Terms and Conditions</a></li>
                                <li><a href="/privacy">Privacy Notice</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div className="footer-links-col">
                            <ul>
                                <li><a href="/experience">About us</a></li>
                                <li><a href="https://booking.com" target="_blank" rel="noopener noreferrer">About Booking.com</a></li>
                                <li><a href="/experience">How We Work</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Middle Section (Social) */}
                <div className="footer-middle">
                    <div className="footer-divider gold-thick"></div>
                    <div className="footer-social-row">
                        <span className="follow-text">Follow Villa Zuri</span>
                        <div className="social-icons">
                            <a href="#" className="social-icon-circle"><Instagram size={18} /></a>
                            <a href="#" className="social-icon-circle"><Music2 size={18} /></a>
                            <a href="#" className="social-icon-circle"><Twitter size={18} /></a>
                            <a href="#" className="social-icon-circle"><Linkedin size={18} /></a>
                            <a href="#" className="social-icon-circle"><Facebook size={18} /></a>
                        </div>
                    </div>
                    <div className="footer-divider gold-thin"></div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom-info">
                    <p className="copyright">&copy; 2012 - {new Date().getFullYear()} Villa Zuri, Inc. All rights reserved.</p>
                    <div className="contact-info">
                        <span>info: stay@villazuri.com</span>
                        <span className="divider-pipe">|</span>
                        <span>Tel: +254 700 000 000</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
