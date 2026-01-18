import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './Navbar.css';

import BookingModal from './BookingModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isBookingOpen, openBooking, closeBooking } = useBooking();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleHomeClick = () => {
        navigate('/');
        window.scrollTo(0, 0);
        toggleMenu();
    };

    const handleBookingClick = (e) => {
        e.preventDefault();
        openBooking();
    };

    const handleOverlayBooking = (e) => {
        e.preventDefault();
        toggleMenu();
        openBooking();
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
                <div className="container navbar-container">
                    <div className={`menu-trigger custom-hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <Link to="/" className="logo" onClick={() => window.scrollTo(0, 0)}>Villa Zuri</Link>

                    <button className="book-button" onClick={handleBookingClick}>BOOK</button>
                </div>
            </nav>

            <div className={`menu-overlay ${isOpen ? 'active' : ''}`}>
                <ul className="overlay-links">
                    <li><button className="overlay-home-btn" onClick={handleHomeClick}>Home</button></li>
                    <li><Link to="/experience" onClick={toggleMenu}>Our Story</Link></li>
                    <li><Link to="/gallery" onClick={toggleMenu}>Gallery</Link></li>
                    <li><Link to="/watamu" onClick={toggleMenu}>Watamu</Link></li>
                    <li><Link to="/blog" onClick={toggleMenu}>Activities</Link></li>
                    <li><button className="overlay-book-btn" onClick={handleOverlayBooking}>Book Your Stay</button></li>
                </ul>
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
        </>
    );
};

export default Navbar;
