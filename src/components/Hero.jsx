import React from 'react';
import './Hero.css';
import heroImage from '../assets/hero.png';

const Hero = () => {
    return (
        <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="hero-title">Your Private Coastal Sanctuary</h1>
                <p className="hero-subtitle">Welcome to VillaZuri</p>
                <a href="#villa" className="cta-button">Explore The Villa</a>
            </div>
        </section>
    );
};

export default Hero;
