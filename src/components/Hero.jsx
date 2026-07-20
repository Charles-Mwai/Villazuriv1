import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const images = [
        "/HERO/DJI_0669.jpg",
        "/HERO/DJI_0674.jpg",
        "/HERO/DJI_0689.jpg",
        "/HERO/DJI_0690.jpg",
        "/HERO/IMG_9215.jpg",
        "/HERO/IMG_9217.jpg",
        "/HERO/IMG_9224.jpg",
        "/HERO/IMG_9229.jpg",
        "/HERO/IMG_9282.jpg",
        "/HERO/IMG_9371.jpg"
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
                <p className="hero-subtitle">Welcome to Watamu</p>
                <Link to="/gallery" className="cta-button">Gallery</Link>
            </div>
        </section>
    );
};

export default Hero;
