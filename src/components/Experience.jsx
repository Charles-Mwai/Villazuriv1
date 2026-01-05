import React from 'react';
import './SectionStyles.css';
import RevealOnScroll from './RevealOnScroll';

const Experience = () => {
    return (
        <section id="experience" className="section-padding container text-center">
            <RevealOnScroll>
                <h2 className="section-title">The VillaZuri Experience</h2>
                <p className="section-text">
                    Nestled on the pristine shores of the Kenyan coast, VillaZuri is more than just a place to stay—it is a sanctuary for the soul.
                    Designed for absolute privacy and tailored luxury, our villa offers a seamless blend of indoor elegance and outdoor serenity.
                    Whether you seek adventure on the reef or tranquility by the pool, every moment is curated to your desires.
                </p>
            </RevealOnScroll>
        </section>
    );
};

export default Experience;
