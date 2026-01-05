import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);


    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <div className="menu-trigger custom-hamburger" onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <a href="#" className="logo">VillaZuri</a>

                    <a href="#book" className="book-button">BOOK</a>
                </div>
            </nav>

            <div className={`menu-overlay ${isOpen ? 'active' : ''}`}>
                <div className="overlay-close" onClick={toggleMenu}>
                    <X size={32} color="#fff" />
                </div>
                <ul className="overlay-links">
                    <li><a href="#villa" onClick={toggleMenu}>The Villa</a></li>
                    <li><a href="#experience" onClick={toggleMenu}>Experience</a></li>
                    <li><a href="#dining" onClick={toggleMenu}>Dining</a></li>
                    <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;
