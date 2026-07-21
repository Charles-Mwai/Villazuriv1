import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const images = [
        "/Archive (3)/HEROO/DJI_0674.jpg",
        "/Archive (3)/HEROO/DJI_0689.jpg",
        "/Archive (3)/HEROO/IMG_9215.jpg",
        "/Archive (3)/HEROO/IMG_9217.jpg",
        "/Archive (3)/HEROO/IMG_9224.jpg",
        "/Archive (3)/HEROO/IMG_9229.jpg",
        "/Archive (3)/HEROO/IMG_9282.jpg"
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
