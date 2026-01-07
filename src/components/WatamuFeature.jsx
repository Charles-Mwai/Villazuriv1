import React from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import './WatamuFeature.css';

const WatamuFeature = () => {
    return (
        <section className="watamu-feature">
            <RevealOnScroll>
                <div className="watamu-feature-content">
                    <h3>Watamu Beach</h3>
                    <Link to="/watamu" className="watamu-explore-btn">EXPLORE</Link>
                </div>
            </RevealOnScroll>
        </section>
    );
};

export default WatamuFeature;
