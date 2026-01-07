import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import './Watamu.css';
import LocationMap from '../../components/LocationMap';

const Watamu = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="watamu-page">
            <Navbar />

            <section className="watamu-hero">
                <div className="hero-text-content">

                    <p>Watamu is a tranquil coastal haven where turquoise waters, pristine beaches, and rich marine life come together to create the perfect getaway.</p>
                </div>
            </section>

            <div className="watamu-content container">
                <RevealOnScroll>
                    <div className="watamu-full-image">
                        <img
                            src="/villa pics/watamu-beach-chiara.jpg"
                            alt="Watamu Beach Coastline"
                        />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll>
                    <div className="location-section">
                        <div className="location-grid">
                            <div className="location-details">
                                <h2>Finding Your Way</h2>
                                <p className="location-intro">
                                    Nestled along the pristine shores, VillaZuri is perfectly positioned
                                    to offer both seclusion and accessibility.
                                </p>
                                <div className="directions-info">
                                    <h3>Directions</h3>
                                    <p>
                                        We are located adjacent to the renowned Papa Remo Village.
                                        From Malindi Airport, take the main coastal road south towards Watamu.
                                        Turn left at the Gede Ruins junction and follow the signs for Papa Remo Beach.
                                    </p>
                                    <p>
                                        Our concierge can arrange private transfers for a seamless arrival experience.
                                    </p>
                                </div>
                            </div>
                            <div className="location-map-frame">
                                <LocationMap
                                    center={{ lat: -3.366, lng: 40.016 }}
                                    zoom={15}
                                />
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>
            </div>
            <Footer />
        </div>
    );
};

export default Watamu;
