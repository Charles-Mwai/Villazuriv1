import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storiesData } from '../../data/storiesData';
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

            <section className="hero">
                {watamuImages.map((img, index) => (
                    <div
                        key={index}
                        className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url("${img}")` }}
                    />
                ))}
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1 className="hero-title">Read all about Watamu Life</h1>
                    <p className="hero-subtitle">Coastal Living at its Finest</p>
                </div>
            </section>

            <div className="watamu-container-redesign">

                {/* Main Content Section */}
                <section className="watamu-text-content">
                    <RevealOnScroll>
                        <h2 className="watamu-section-title">Villazuri, Watamu</h2>
                        <p className="watamu-section-subtitle">Where Coastal Luxury Meets Endless Experiences</p>
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
                            {storiesData.map((story) => (
                                <div key={story.id} className="story-card">
                                    <Link to={`/stories/${story.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img src={story.image} alt={story.title} className="story-image" loading="lazy" />
                                        <h4>{story.title}</h4>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Watamu;
