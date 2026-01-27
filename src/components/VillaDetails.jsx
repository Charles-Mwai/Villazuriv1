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
                        <h3 style={{ color: '#0A4D2A' }}>Living</h3>
                        <p>
                            The villa features three bedrooms and three bathrooms, including a living room with a sofa bed. Family rooms provide ample space for relaxation, while amenities such as air-conditioning, a fully equipped kitchen, and a washing machine ensure a comfortable stay.
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
                        <h3 style={{ color: '#0A4D2A' }}>Play</h3>
                        <p>
                            Villa Zuri at Papa Remo in Watamu offers a private beach area, a lush garden, and a spacious terrace. Guests can relax by the year-round outdoor swimming pool and enjoy free WiFi throughout the property.
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
                        <h3 style={{ color: '#0A4D2A' }}>Relaxation</h3>
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
