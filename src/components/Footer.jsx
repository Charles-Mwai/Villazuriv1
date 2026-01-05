import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <h4>VillaZuri</h4>
                    <p>Watamu Beach, Kenya</p>
                </div>
                <div className="footer-contact">
                    <p>Bookings: <a href="mailto:stay@villazuri.com">stay@villazuri.com</a></p>
                    <p>Tel: +254 700 000 000</p>
                </div>

            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} VillaZuri. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
