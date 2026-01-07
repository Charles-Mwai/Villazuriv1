import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Watamu.css';

const Watamu = () => {
    return (
        <div className="watamu-page">
            <Navbar />
            <div className="watamu-container">
                <section className="watamu-hero">
                    <div className="hero-text-content">
                        <p>Watamu is a tranquil coastal haven where turquoise waters, pristine beaches, and rich marine life come together to create the perfect getaway.</p>
                    </div>
                </section>
                <section className="watamu-content">
                    <p>Coming Soon...</p>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Watamu;
