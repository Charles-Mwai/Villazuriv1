import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MarqueeGallery.css';

const MarqueeGallery = () => {
    const navigate = useNavigate();

    // A selection of highlight images for the marquee
    const highlightImages = [
        'IMG_5485-cmpr.jpg', 'IMG_5487-cmpr.jpg', 'IMG_5489-cmpr.jpg',
        'IMG_5491-cmpr.jpg', 'IMG_5494-cmpr.jpg', 'IMG_5496-cmpr.jpg',
        'IMG_5500-cmpr.jpg', 'IMG_5503-cmpr.jpg', 'IMG_5506-cmpr.jpg',
        'IMG_5511-cmpr.jpg', 'IMG_5517-cmpr.jpg', 'IMG_5521-cmpr.jpg'
    ];

    // Double the images for seamless infinite scroll
    const marqueeImages = [...highlightImages, ...highlightImages];

    return (
        <section className="marquee-section">
            <div className="marquee-wrapper" onClick={() => navigate('/gallery')}>
                <div className="marquee-track">
                    {marqueeImages.map((img, idx) => (
                        <div key={`${img}-${idx}`} className="marquee-item">
                            <img src={`/villa pics/${img}`} alt={`Villa Zuri interior and exterior highlight ${idx + 1}`} />
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
