import React, { useState, useEffect } from 'react';
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

const Blog = () => {
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        const interval = setInterval(() => {
            setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % allActivityImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="blog-page">
            <Navbar />

            <section className="blog-hero-custom">
                {allActivityImages.map((img, index) => (
                    <div
                        key={index}
                        className={`hero-background ${index === currentHeroImageIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url("${img}")` }}
                    />
                ))}
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1 className="hero-title">What To do While You Stay With Us</h1>
                </div>
            </section>

            <main className="villa-details">
                {/* 1. Dolphin Watching */}
                <div className="grid-row">
                    <div className="grid-image">
                        <img src="/ty-tomlinson-TZAHcS2a9wY-unsplash.jpg" alt="Dolphin Watching" loading="lazy" />
                    </div>
                    <div className="grid-content">
                        <RevealOnScroll>
                            <h3>Dolphin Watching</h3>
                            <p>
                                Watch playful dolphins glide through Watamu’s warm waters, where early morning boat trips offer a chance to see these graceful creatures swimming freely in their natural habitat. Guided by experienced locals, you’ll enjoy a calm, respectful encounter surrounded by turquoise seas, gentle ocean breezes, and the quiet beauty that makes Watamu feel truly special.
                            </p>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* 2. Dhow Cruise (Reverse) */}
                <div className="grid-row reverse">
                    <div className="grid-image">
                        <img src="/prolific-ke-sxViCE1d2Cw-unsplash.jpg" alt="Dhow Cruise" loading="lazy" />
                    </div>
                    <div className="grid-content">
                        <RevealOnScroll>
                            <h3>Dhow Cruise</h3>
                            <p>
                                As evening approaches, a traditional sunset dhow cruise offers a timeless coastal experience. Gliding along the shoreline as the sky glows with sunset hues is a beautiful way to end the day before returning to the comfort of Villa Zuri.
                            </p>
                            <p>
                                Spend leisurely days along Watamu Beach and Turtle Bay, where soft white sands and warm, shallow waters create an ideal setting for swimming, sunbathing, or quiet reflection by the ocean.
                            </p>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* 3. Dining */}
                <div className="grid-row">
                    <div className="grid-image">
                        <img src="/tomi-saputra-kIXNJ5PETyM-unsplash.jpg" alt="Dining" loading="lazy" />
                    </div>
                    <div className="grid-content">
                        <RevealOnScroll>
                            <h3>Dining</h3>
                            <p>
                                Enjoy fresh seafood and Swahili flavors at Watamu’s beachfront restaurants. Experience the rich culinary heritage of the coast, where every meal is a celebration of fresh, local ingredients and traditional cooking methods.
                            </p>
                            <p>
                                From casual beach bars to fine dining establishments, Watamu offers a diverse range of culinary experiences to satisfy every palate.
                            </p>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* 4. Marine Park (Reverse) */}
                <div className="grid-row reverse">
                    <div className="grid-image">
                        <img src="/milos-prelevic-U0R6cck6V9U-unsplash.jpg" alt="Marine Park" loading="lazy" />
                    </div>
                    <div className="grid-content">
                        <RevealOnScroll>
                            <h3>Marine Park</h3>
                            <p>
                                The nearby Watamu Marine National Park invites guests to explore vibrant coral reefs and crystal-clear waters teeming with tropical fish, sea turtles, and graceful rays. Snorkeling and scuba diving here are world-class, offering serene yet colorful underwater encounters.
                            </p>
                            <p>
                                Beyond the beach, Watamu reveals a softer, greener side. Mida Creek, a peaceful mangrove ecosystem, is perfect for kayaking, birdwatching, or guided boat tours through calm tidal waters.
                            </p>
                        </RevealOnScroll>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
