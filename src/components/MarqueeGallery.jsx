import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MarqueeGallery.css';

const MarqueeGallery = () => {
    const navigate = useNavigate();

    // A selection of highlight images for the marquee — sourced from the current Archive (3) gallery
    const highlightImages = [
        '/Archive (3)/LIVING/IMG_9204.jpg',
        '/Archive (3)/LIVING/IMG_9349.jpg',
        '/Archive (3)/BEDROOM/IMG_9244.jpg',
        '/Archive (3)/BEDROOM/IMG_9341.jpg',
        '/Archive (3)/BATHROOM/IMG_9334.jpg',
        '/Archive (3)/BATHROOM/IMG_9336.jpg',
        '/Archive (3)/KITCHEN/IMG_9211.jpg',
        '/Archive (3)/KITCHEN/IMG_9301.jpg',
        '/Archive (3)/TERRACE/IMG_9383.jpg',
        '/Archive (3)/TERRACE/IMG_9399.jpg',
        '/Archive (3)/GREEN/DJI_0671.jpg',
        '/Archive (3)/DECOR/IMG_9408.jpg',
    ];

    // Double the images for seamless infinite scroll
    const marqueeImages = [...highlightImages, ...highlightImages];

    return (
        <section className="marquee-section">
            <div className="marquee-wrapper" onClick={() => navigate('/gallery')}>
                <div className="marquee-track">
                    {marqueeImages.map((img, idx) => (
                        <div key={`${img}-${idx}`} className="marquee-item">
                            <img src={img} alt={`Villa Zuri interior and exterior highlight ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="marquee-cta container">
                <button
                    className="view-all-gallery-btn"
                    onClick={() => navigate('/gallery')}
                >
                    View All Gallery
                </button>
            </div>
        </section>
    );
};

export default MarqueeGallery;
