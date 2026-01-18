import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activitiesData } from '../../data/activitiesData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import '../../components/SectionStyles.css';
import './Blog.css';


const allActivityImages = [
    '/second activities/WhatsApp Image 2026-01-08 at 12.54.00.jpg',
    '/second activities/WhatsApp Image 2026-01-08 at 12.56.02.jpg',
    '/second activities/WhatsApp Image 2026-01-08 at 13-fotor-20260114201512.jpg',
    '/second activities/WhatsApp Image 2026-01-08 at 13.00.13.jpg'
];

const watamuImages = [
    '/watamu/abdul-noor-cGOVWwGKmwM-unsplash.jpg',
    '/watamu/andrew-molo-hdzYmowUDJY-unsplash.jpg',
    '/watamu/john-mukiibi-elijah-dOaiQnOPO60-unsplash.jpg',
    '/watamu/timothy-k-5KBI2j3UDR0-unsplash.jpg',
    '/watamu/wexor-tmg-L-2p8fapOA8-unsplash.jpg'
];

const Blog = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentWatamuImageIndex, setCurrentWatamuImageIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        const blogInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allActivityImages.length);
        }, 5000);

        const watamuInterval = setInterval(() => {
            setCurrentWatamuImageIndex((prevIndex) => (prevIndex + 1) % watamuImages.length);
        }, 5000);

        return () => {
            clearInterval(blogInterval);
            clearInterval(watamuInterval);
        };
    }, []);

    return (
        <div className="blog-page-redesign">
            <Navbar />

            <div className="blog-container-redesign">
                {/* Header Section */}
                <header className="blog-header">
                    <h1>What To do While You Stay With Us</h1>
                </header>

                {/* Slideshow Hero Section */}
                <section className="blog-hero-image">
                    {allActivityImages.map((img, index) => (
                        <div
                            key={index}
                            className={`blog-hero-background ${index === currentImageIndex ? 'active' : ''}`}
                            style={{ backgroundImage: `url("${img}")` }}
                        />
                    ))}
                </section>

                {/* Main Content Section */}
                <section className="blog-text-content">
                    <RevealOnScroll>
                        <h2>Discover Watamu's Coastal Wonders</h2>
                        <p>
                            Watch playful dolphins glide through Watamu's warm waters, where early morning boat trips offer a chance to see these graceful creatures swimming freely in their natural habitat. Guided by experienced locals, you'll enjoy a calm, respectful encounter surrounded by turquoise seas, gentle ocean breezes, and the quiet beauty that makes Watamu feel truly special.
                        </p>
                        <p>
                            As evening approaches, a traditional sunset dhow cruise offers a timeless coastal experience. Gliding along the shoreline as the sky glows with sunset hues is a beautiful way to end the day before returning to the comfort of Villa Zuri.
                        </p>
                        <p>
                            The nearby Watamu Marine National Park invites guests to explore vibrant coral reefs and crystal-clear waters teeming with tropical fish, sea turtles, and graceful rays. Snorkeling and scuba diving here are world-class, offering serene yet colorful underwater encounters.
                        </p>
                        <p>
                            Enjoy fresh seafood and Swahili flavors at Watamu's beachfront restaurants. Experience the rich culinary heritage of the coast, where every meal is a celebration of fresh, local ingredients and traditional cooking methods.
                        </p>
                    </RevealOnScroll>
                </section>

                {/* Read More Stories Section */}
                <section className="blog-stories-section">
                    <RevealOnScroll>
                        <h3>Activities you might like</h3>
                        <div className="stories-grid">
                            {activitiesData.map((activity) => (
                                <Link key={activity.id} to={`/activities/${activity.id}`} className="story-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <img src={activity.image} alt={activity.title} className="story-image" loading="lazy" />
                                    <h4>{activity.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </RevealOnScroll>
                </section>
            </div>

            {/* Spacing between Blog and Watamu sections */}
            <div className="section-divider"></div>

            {/* Watamu Section */}
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
                            className={`watamu-hero-background ${index === currentWatamuImageIndex ? 'active' : ''}`}
                            style={{ backgroundImage: `url("${img}")` }}
                        />
                    ))}
                </section>

                {/* Main Content Section */}
                <section className="watamu-text-content">
                    <RevealOnScroll>
                        <h2>Villazuri, Watamu — Where Coastal Luxury Meets Endless Experiences</h2>
                        <p>
                            Set along Kenya's Indian Ocean coastline, Villazuri is a refined retreat in the heart of Watamu, offering privacy, comfort, and effortless access to one of the coast's most enchanting destinations. Surrounded by natural beauty, Swahili heritage, and the soothing rhythm of the ocean, it's the perfect place to unwind while staying close to unforgettable experiences.
                        </p>
                        <p>
                            From vibrant coral reefs in Watamu Marine National Park to relaxed days on Watamu Beach and Turtle Bay, the sea is always within reach. Enjoy world-class snorkeling and diving, sunset dhow cruises, or ocean adventures like deep-sea fishing, kayaking, paddleboarding, and kite surfing.
                        </p>
                        <p>
                            Beyond the shoreline, explore the tranquil mangroves of Mida Creek, the rich wildlife of Arabuko-Sokoke Forest, and the timeless history of the Gede Ruins. Discover local markets, coastal cuisine, and conservation experiences, from turtle releases to private boat trips to secluded sandbanks.
                        </p>
                        <p>
                            Villazuri is more than a villa — it's your gateway to Watamu, where luxury, nature, and authentic coastal experiences come together to create lasting memories.
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

export default Blog;
