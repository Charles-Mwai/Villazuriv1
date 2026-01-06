import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import './Gallery.css';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Generate array of all 76 image filenames
        const imageList = [];

        // IMG_5485 to IMG_5546
        for (let i = 5485; i <= 5546; i++) {
            const filename = `IMG_${i}-cmpr.jpg`;
            imageList.push(filename);
        }

        // Add the HDR image
        imageList.push('IMG_5533-HDR-cmpr.jpg');

        // IMG_5547 to IMG_5573 (continuing the sequence)
        for (let i = 5547; i <= 5573; i++) {
            const filename = `IMG_${i}-cmpr.jpg`;
            imageList.push(filename);
        }

        setImages(imageList);
    }, []);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, images.length]);

    return (
        <>
            <section id="gallery" className="gallery-section">
                <div className="container gallery-container">
                    <RevealOnScroll>
                        <h2 className="gallery-title">Villa Gallery</h2>
                        <p className="gallery-subtitle">
                            Discover the beauty and luxury of VillaZuri through our curated collection
                        </p>
                    </RevealOnScroll>

                    <div className="gallery-grid">
                        {images.map((image, index) => (
                            <RevealOnScroll key={image}>
                                <div
                                    className="gallery-item"
                                    onClick={() => openLightbox(index)}
                                >
                                    <img
                                        src={`/villa pics/${image}`}
                                        alt={`Villa view ${index + 1}`}
                                        loading="lazy"
                                    />
                                    <div className="gallery-overlay">
                                        <span className="view-text">View</span>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={32} />
                    </button>

                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`/villa pics/${images[currentImageIndex]}`}
                            alt={`Villa view ${currentImageIndex + 1}`}
                        />
                        <div className="lightbox-counter">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>

                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                    >
                        <ChevronRight size={40} />
                    </button>
                </div>
            )}
        </>
    );
};

export default Gallery;
