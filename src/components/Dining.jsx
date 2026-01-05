import React from 'react';
import './SectionStyles.css';
import diningImg from '../assets/dining.png';

const Dining = () => {
    return (
        <section id="dining" className="dining-section">
            <div className="dining-overlay">
                <img src={diningImg} alt="Gourmet Seafood Dining" className="dining-bg" />
                <div className="dining-content container">
                    <h2 className="section-title text-white">Culinary Excellence</h2>
                    <p className="section-text text-white">
                        Our private chefs prepare daily menus based on your preferences and the freshest catch from local fishermen.
                        Experience award-winning seafood and Italian-influenced cuisine served in the privacy of your villa or under the stars.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Dining;
