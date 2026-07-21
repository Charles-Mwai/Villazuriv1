import React from 'react';
import './SectionStyles.css';
import RevealOnScroll from './RevealOnScroll';
import Slideshow from './Slideshow';

const interiorImages = [
    '/hliving/IMG_9216.jpg',
    '/hliving/IMG_9239.jpg',
    '/hliving/IMG_9340.jpg'
];

const exteriorImages = [
    '/play/DJI_0689.jpg',
    '/play/IMG_9359.jpg',
    '/play/IMG_9371.jpg'
];

const outdoorImages = [
    '/relaxation/IMG_9359.jpg',
    '/relaxation/IMG_9362.jpg',
    '/relaxation/IMG_9418.jpg'
];

const VillaDetails = () => {
    return (
        <section id="villa" className="villa-details">
            <div className="grid-row">
                <div className="grid-image">
                    <Slideshow images={interiorImages} interval={5000} ariaLabel="Villa Zuri interior living spaces" />
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3 style={{ color: '#264D52' }}>Living</h3>
                        <p>
                            The villa features three bedrooms and three bathrooms, including a living room with a sofa bed. Family rooms provide ample space for relaxation, while amenities such as air-conditioning, a fully equipped kitchen, and a washing machine ensure a comfortable stay.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="grid-row reverse">
                <div className="grid-image">
                    <Slideshow images={exteriorImages} interval={5000} ariaLabel="Villa Zuri exterior and gardens" />
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3 style={{ color: '#264D52' }}>Play</h3>
                        <p>
                            Villa Zuri at Papa Remo in Watamu offers a private beach area, a lush garden, and a spacious terrace. Guests can relax by the year-round outdoor swimming pool and enjoy free WiFi throughout the property.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="grid-row">
                <div className="grid-image">
                    <Slideshow images={outdoorImages} interval={5000} ariaLabel="Villa Zuri outdoor pool and beach areas" />
                </div>
                <div className="grid-content">
                    <RevealOnScroll>
                        <h3 style={{ color: '#264D52' }}>Relaxation</h3>
                        <p>
                            Experience the harmony of nature and luxury. Our outdoor spaces are designed to provide
                            the perfect balance of relaxation and adventure. Whether you wish to bask in the sun
                            or enjoy a quiet evening breeze, tranquility awaits you at Villa Zuri.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
};

export default VillaDetails;
