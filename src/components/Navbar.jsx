import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

import BookingModal from './BookingModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleBookingClick = (e) => {
        e.preventDefault();
        setIsBookingOpen(true);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <div className="menu-trigger custom-hamburger" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <Link to="/" className="logo">VillaZuri</Link>

                    <button className="book-button" onClick={handleBookingClick}>BOOK</button>
                </div>
            </nav>

            <div className={`menu-overlay ${isOpen ? 'active' : ''}`}>
                <div className="overlay-close" onClick={toggleMenu}>
                    <X size={32} color="#fff" />
                </div>
                <ul className="overlay-links">
                    <li><a href="#villa" onClick={toggleMenu}>The Villa</a></li>
                    <li><a href="#experience" onClick={toggleMenu}>Experience</a></li>
                    <li><Link to="/gallery" onClick={toggleMenu}>Gallery</Link></li>
                    <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
                </ul>
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        </>
    );
};

export default Navbar;
