import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import Slideshow from '../../components/Slideshow';
import './ExperiencePage.css';

const ExperiencePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="experience-page">
            <Navbar />

            {/* Hero Section */}
            <section className="experience-hero">
                <div className="experience-hero-overlay">
                    {/* Title removed per user request */}
                </div>
            </section>

            {/* Intro Content - White Background */}
            <section className="experience-intro container">
                <RevealOnScroll>
                    <div className="intro-text">
                        <h2>The Villa Zuri Experience</h2>
                        <p>
                            Villa Zuri offers a private, relaxed coastal escape in Watamu, where comfort and understated luxury come together. Your stay is thoughtfully personalized, with tailored dining, inclusive meals and drinks, and attentive service that makes everything feel effortless.
                        </p>
                        <p>
                            Whether you choose to unwind at the villa or explore Watamu’s marine life and coastal activities, every moment is designed to feel easy, personal, and memorable—leaving you feeling truly at home.
                        </p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* Zig-Zag Sections */}
            <div className="experience-sections">
                {/* Activities: Text Left, Image Right */}
                <section className="content-split-section">
                    <div className="container split-container">
                        <RevealOnScroll>
                            <div className="split-content text-left">
                                <h3>Activities</h3>


                                <p>
                                    During your stay at Villa Zuri, you can easily enjoy Watamu’s most loved experiences—from watching dolphins in the warm ocean waters to sailing at sunset on a traditional dhow. Explore the vibrant marine life of Watamu Marine Park, then unwind with fresh seafood and Swahili flavors at the area’s beachfront restaurants.
                                </p>
                                {/* Link removed per user request */}
                            </div>
                        </RevealOnScroll>
                        <div className="split-image">
                            <Slideshow
                                images={[
                                    '/Activities/activity-1.jpg',
                                    '/Activities/activity-2.jpg',
                                    '/Activities/activity-3.jpg',
                                    '/Activities/activity-4.jpg'
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* Service: Image Left, Text Right */}
                <section className="content-split-section reverse-mobile">
                    <div className="container split-container reverse-layout">
                        <RevealOnScroll>
                            <div className="split-content text-right">
                                <h3>Service</h3>
                                <p>
                                    Along with the dedicated Villa Zuri team, we offer the highest standard of privacy and concierge service. Expect a sophisticated yet discreet 24/7 presence of staff and bespoke in-villa experiences such as romantic dinners, sundowners, and curated cuisine experiences.
                                </p>
                                <p>
                                    Complimentary child-minding services are also offered to allow parents much-deserved downtime, while we also offer a range of family activities that can be enjoyed together.
                                </p>
                            </div>
                        </RevealOnScroll>
                        <div className="split-image">
                            <img src="/IMG_5515-cmpr.jpg" alt="Private dining on the beach" />
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default ExperiencePage;
