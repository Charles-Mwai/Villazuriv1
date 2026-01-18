import React from 'react';
import './SectionStyles.css';
import RevealOnScroll from './RevealOnScroll';
import Slideshow from './Slideshow';

const interiorImages = [
    '/Interior pics/IMG_5518-cmpr.jpg',
    '/Interior pics/IMG_5535.JPG',
    '/Interior pics/IMG_5507.JPG'
];

const exteriorImages = [
    '/villa pics/IMG_5541-cmpr.jpg',
    '/villa pics/IMG_5487-cmpr.jpg',
    '/Exterior pics/IMG_3827-cmpr.jpg'
];

const outdoorImages = [
    '/WhatsApp Image 2026-01-08 at 12.18.55.jpg',
    '/WhatsApp Image 2026-01-08 at 12.18.55.jpeg',
    '/IMG_5552-cmpr.jpg'
];

const VillaDetails = () => {
    return (
        <section id="villa" className="villa-details">
            <div className="grid-row">
                <div className="grid-image">
                    <Slideshow images={interiorImages} interval={5000} />
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Living</h3>
                        <p>
                            Awake to the sound of the ocean in our masterfully designed suites.
                            Detailed with locally sourced furniture and high-end linens,
                            every room frames the turquoise horizon.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="grid-row reverse">
                <div className="grid-image">
                    <Slideshow images={exteriorImages} interval={5000} />
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Play</h3>
                        <p>
                            The centerpiece of Villa Zuri is your Swimming Pool,
                            seemingly merging with the Indian Ocean. Relax on the sun deck
                            with a cocktail in hand, surrounded by lush tropical gardens.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="grid-row">
                <div className="grid-image">
                    <Slideshow images={outdoorImages} interval={5000} />
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3>Relaxation</h3>
                        <p>
                            Experience the harmony of nature and luxury. Our outdoor spaces are designed to provide
                            the perfect balance of relaxation and adventure. Whether you wish to bask in the sun
                            or enjoy a quiet evening breeze, the Relaxation await you.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
};

export default VillaDetails;
