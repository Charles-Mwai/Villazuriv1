import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" style={{ backgroundImage: `url("/villa pics/IMG_5487-cmpr.jpg")` }}>
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="hero-title">Your Private Coastal Sanctuary</h1>
                <p className="hero-subtitle">Welcome to VillaZuri</p>
                <Link to="/gallery" className="cta-button">Explore The Villa</Link>
            </div>
        </section>
    );
};

export default Hero;
