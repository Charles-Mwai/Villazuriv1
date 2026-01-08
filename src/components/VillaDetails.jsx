import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SectionStyles.css';
import RevealOnScroll from './RevealOnScroll';

const interiorImages = [
    '/Interior pics/IMG_5518-cmpr.jpg',
    '/Interior pics/IMG_5535.JPG',
    '/Interior pics/IMG_5507.JPG'
];

const exteriorImages = [
    '/villa pics/IMG_5541-cmpr.jpg',
    '/villa pics/IMG_5487-cmpr.jpg',
    '/Exterior pics/IMG_3827-cmpr.jpg'
];

const outdoorImages = [
    '/WhatsApp Image 2026-01-08 at 12.18.55.jpg',
    '/WhatsApp Image 2026-01-08 at 12.18.55.jpeg',
    '/IMG_5552-cmpr.jpg'
];

const activities = [
    {
        title: 'Dolphin Watching',
        image: '/Activities/WhatsApp Image 2026-01-08 at 12.54.00.jpeg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
        title: 'Dhow Cruise',
        image: '/Activities/WhatsApp Image 2026-01-08 at 12.56.02.jpeg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
        title: 'Dining',
        image: '/Activities/WhatsApp Image 2026-01-08 at 13.00.13.jpeg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
        title: 'Marine Park',
        image: '/Activities/WhatsApp Image 2026-01-08 at 13.00.14.jpeg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
];

const VillaDetails = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentExteriorIndex, setCurrentExteriorIndex] = useState(0);
    const [currentOutdoorIndex, setCurrentOutdoorIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % interiorImages.length);
    };

    const nextExteriorImage = () => {
        setCurrentExteriorIndex((prevIndex) => (prevIndex + 1) % exteriorImages.length);
    };

    const nextOutdoorImage = () => {
        setCurrentOutdoorIndex((prevIndex) => (prevIndex + 1) % outdoorImages.length);
    };

    return (
        <section id="villa" className="villa-details">
            <div className="grid-row">
                <div className="grid-image carousel-container">
                    <RevealOnScroll>
                        <img
                            src={interiorImages[currentImageIndex]}
                            alt={`Elegant Interior ${currentImageIndex + 1}`}
                            className="carousel-image"
                        />
                        <button
                            className="carousel-arrow"
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </RevealOnScroll>
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Living</h3>
                        <p>
                            Awake to the sound of the ocean in our masterfully designed suites.
                            Detailed with locally sourced furniture and high-end linens,
                            every room frames the turquoise horizon.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="grid-row reverse">
                <div className="grid-image carousel-container">
                    <RevealOnScroll>
                        <img
                            src={exteriorImages[currentExteriorIndex]}
                            alt={`Exterior Oasis ${currentExteriorIndex + 1}`}
                            className="carousel-image"
                        />
                        <button
                            className="carousel-arrow"
                            onClick={nextExteriorImage}
                            aria-label="Next image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </RevealOnScroll>
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Play</h3>
                        <p>
                            The centerpiece of Villa Zuri is your Swimming Pool,
                            seemingly merging with the Indian Ocean. Relax on the sun deck
                            with a cocktail in hand, surrounded by lush tropical gardens.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="grid-row">
                <div className="grid-image carousel-container">
                    <RevealOnScroll>
                        <img
                            src={outdoorImages[currentOutdoorIndex]}
                            alt={`Relaxation ${currentOutdoorIndex + 1}`}
                            className="carousel-image"
                        />
                        <button
                            className="carousel-arrow"
                            onClick={nextOutdoorImage}
                            aria-label="Next image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </RevealOnScroll>
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Relaxation</h3>
                        <p>
                            Experience the harmony of nature and luxury. Our outdoor spaces are designed to provide
                            the perfect balance of relaxation and adventure. Whether you wish to bask in the sun
                            or enjoy a quiet evening breeze, the Relaxation await you.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="features-section">
                <div className="container">
                    <h3 className="activities-subheading">Things to do while you stay with us</h3>
                    <div className="features-grid">
                        {activities.map((item, index) => (
                            <div key={index} className="feature-item">
                                <div className="feature-image-wrapper">
                                    <img src={item.image} alt={item.title} className="feature-image" />
                                </div>
                                <h4>{item.title}</h4>
                                <Link to="/blog" className="activity-link">Read More</Link>
                                <p className="feature-description">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VillaDetails;
