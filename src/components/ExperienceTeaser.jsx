import React from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import './ExperienceTeaser.css';

const ExperienceTeaser = () => {
    return (
        <section className="experience-teaser">
            <RevealOnScroll>
                <div className="teaser-content">
                    <h2 className="text-white">Our Story</h2>
                    <Link to="/experience" className="teaser-button" onClick={() => window.scrollTo(0, 0)}>
                        READ
                    </Link>
                </div>
            </RevealOnScroll>
        </section>
    );
};

export default ExperienceTeaser;
