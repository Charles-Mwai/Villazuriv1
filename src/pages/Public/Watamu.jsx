import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import './Watamu.css';

const watamuImages = [
    '/watamu/abdul-noor-cGOVWwGKmwM-unsplash.jpg',
    '/watamu/andrew-molo-hdzYmowUDJY-unsplash.jpg',
    '/watamu/john-mukiibi-elijah-dOaiQnOPO60-unsplash.jpg',
    '/watamu/timothy-k-5KBI2j3UDR0-unsplash.jpg',
    '/watamu/wexor-tmg-L-2p8fapOA8-unsplash.jpg'
];

const Watamu = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % watamuImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="watamu-page-redesign">
            <Navbar />

            <div className="watamu-container-redesign">
                {/* Header Section */}
                <header className="watamu-header">
                    <h1>Read all about Watamu Life</h1>
                </header>

                {/* Slideshow Hero Section */}
                <section className="watamu-hero-image">
                    {watamuImages.map((img, index) => (
                        <div
                            key={index}
                            className={`watamu-hero-background ${index === currentImageIndex ? 'active' : ''}`}
                            style={{ backgroundImage: `url("${img}")` }}
                        />
                    ))}
                </section>

                {/* Main Content Section */}
                <section className="watamu-text-content">
                    <RevealOnScroll>
                        <h2>Villazuri, Watamu — Where Coastal Luxury Meets Endless Experiences</h2>
                        <p>
                            Set along Kenya’s Indian Ocean coastline, Villazuri is a refined retreat in the heart of Watamu, offering privacy, comfort, and effortless access to one of the coast’s most enchanting destinations. Surrounded by natural beauty, Swahili heritage, and the soothing rhythm of the ocean, it’s the perfect place to unwind while staying close to unforgettable experiences.
                        </p>
                        <p>
                            From vibrant coral reefs in Watamu Marine National Park to relaxed days on Watamu Beach and Turtle Bay, the sea is always within reach. Enjoy world-class snorkeling and diving, sunset dhow cruises, or ocean adventures like deep-sea fishing, kayaking, paddleboarding, and kite surfing.
                        </p>
                        <p>
                            Beyond the shoreline, explore the tranquil mangroves of Mida Creek, the rich wildlife of Arabuko-Sokoke Forest, and the timeless history of the Gede Ruins. Discover local markets, coastal cuisine, and conservation experiences, from turtle releases to private boat trips to secluded sandbanks.
                        </p>
                        <p>
                            Villazuri is more than a villa — it’s your gateway to Watamu, where luxury, nature, and authentic coastal experiences come together to create lasting memories.
                        </p>
                    </RevealOnScroll>
                </section>

                {/* Read More Stories Section */}
                <section className="watamu-stories-section">
                    <RevealOnScroll>
                        <h3>Read more stories</h3>
                        <div className="stories-grid">
                            <div className="story-card">
                                <img src="/watamu/dimitry-b-gO3uzl86USU-unsplash.jpg" alt="Watamu Living" className="story-image" loading="lazy" />
                                <h4>Watamu Living</h4>
                            </div>
                            <div className="story-card">
                                <img src="/watamu/abner-abiu-castillo-diaz-N5ByCirHVqw-unsplash.jpg" alt="Solo Tripping" className="story-image" loading="lazy" />
                                <h4>Solo Tripping</h4>
                            </div>
                            <div className="story-card">
                                <img src="/watamu/maximus-beaumont-v30ztCrmzQg-unsplash.jpg" alt="Dining Experience" className="story-image" loading="lazy" />
                                <h4>Dining Experience</h4>
                            </div>
                        </div>
                    </RevealOnScroll>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Watamu;
