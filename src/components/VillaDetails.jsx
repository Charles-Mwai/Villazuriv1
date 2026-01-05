import React from 'react';
import './SectionStyles.css';
import bedroomImg from '../assets/bedroom.png';
import poolImg from '../assets/pool.png';
import RevealOnScroll from './RevealOnScroll';

const VillaDetails = () => {
    return (
        <section id="villa" className="villa-details">
            <div className="grid-row">
                <div className="grid-image">
                    <RevealOnScroll>
                        <img src={bedroomImg} alt="Luxury Master Bedroom" />
                    </RevealOnScroll>
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Elegant Interiors</h3>
                        <p>
                            Awake to the sound of the ocean in our masterfully designed suites.
                            Detailed with locally sourced Lamu furniture and high-end linens,
                            every room frames the turquoise horizon.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="grid-row reverse">
                <div className="grid-image">
                    <RevealOnScroll>
                        <img src={poolImg} alt="Infinity Pool" />
                    </RevealOnScroll>
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Your Private Oasis</h3>
                        <p>
                            The centerpiece of VillaZuri is your private infinity pool,
                            seemingly merging with the Indian Ocean. Relax on the sun deck
                            with a cocktail in hand, surrounded by lush tropical gardens.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
};

export default VillaDetails;
