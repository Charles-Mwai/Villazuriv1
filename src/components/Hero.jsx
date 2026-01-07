import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const images = [
        "/villa pics/IMG_5490-cmpr.jpg",
        "/villa pics/IMG_5491-cmpr.jpg",
        "/villa pics/IMG_5492-cmpr.jpg",
        "/villa pics/IMG_5541-cmpr.jpg",
        "/villa pics/WhatsApp Image 2026-01-07 at 13.16.51.jpg"
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="hero">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url("${img}")` }}
                />
            ))}
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
