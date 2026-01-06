import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import RevealOnScroll from '../../components/RevealOnScroll';
import './FullGallery.css';

const FullGallery = () => {
    const [images, setImages] = useState([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const imageList = [
            'IMG_5485-cmpr.jpg', 'IMG_5487-cmpr.jpg', 'IMG_5488-cmpr.jpg', 'IMG_5489-cmpr.jpg',
            'IMG_5490-cmpr.jpg', 'IMG_5491-cmpr.jpg', 'IMG_5492-cmpr.jpg', 'IMG_5494-cmpr.jpg',
            'IMG_5495-cmpr.jpg', 'IMG_5496-cmpr.jpg', 'IMG_5497-cmpr.jpg', 'IMG_5499-cmpr.jpg',
            'IMG_5500-cmpr.jpg', 'IMG_5501-cmpr.jpg', 'IMG_5502-cmpr.jpg', 'IMG_5503-cmpr.jpg',
            'IMG_5504-cmpr.jpg', 'IMG_5505-cmpr.jpg', 'IMG_5506-cmpr.jpg', 'IMG_5507-cmpr.jpg',
            'IMG_5508-cmpr.jpg', 'IMG_5509-cmpr.jpg', 'IMG_5510-cmpr.jpg', 'IMG_5511-cmpr.jpg',
            'IMG_5512-cmpr.jpg', 'IMG_5514-cmpr.jpg', 'IMG_5515-cmpr.jpg', 'IMG_5516-cmpr.jpg',
            'IMG_5517-cmpr.jpg', 'IMG_5518-cmpr.jpg', 'IMG_5519-cmpr.jpg', 'IMG_5521-cmpr.jpg',
            'IMG_5522-cmpr.jpg', 'IMG_5523-cmpr.jpg', 'IMG_5524-cmpr.jpg', 'IMG_5525-cmpr.jpg',
            'IMG_5526-cmpr.jpg', 'IMG_5527-cmpr.jpg', 'IMG_5530-cmpr.jpg', 'IMG_5531-cmpr.jpg',
            'IMG_5532-cmpr.jpg', 'IMG_5533-HDR-cmpr.jpg', 'IMG_5535-cmpr.jpg', 'IMG_5536-cmpr.jpg',
            'IMG_5538-cmpr.jpg', 'IMG_5539-cmpr.jpg', 'IMG_5541-cmpr.jpg', 'IMG_5543-cmpr.jpg',
            'IMG_5545-cmpr.jpg', 'IMG_5546-cmpr.jpg', 'IMG_5547-cmpr.jpg', 'IMG_5548-cmpr.jpg',
            'IMG_5550-cmpr.jpg', 'IMG_5551-cmpr.jpg', 'IMG_5552-cmpr.jpg', 'IMG_5553-cmpr.jpg',
            'IMG_5554-cmpr.jpg', 'IMG_5555-cmpr.jpg', 'IMG_5556-cmpr.jpg', 'IMG_5557-cmpr.jpg',
            'IMG_5558-cmpr.jpg', 'IMG_5559-cmpr.jpg', 'IMG_5560-cmpr.jpg', 'IMG_5561-cmpr.jpg',
            'IMG_5562-cmpr.jpg', 'IMG_5563-cmpr.jpg', 'IMG_5564-cmpr.jpg', 'IMG_5565-cmpr.jpg',
            'IMG_5566-cmpr.jpg', 'IMG_5567-cmpr.jpg', 'IMG_5568-cmpr.jpg', 'IMG_5569-cmpr.jpg',
            'IMG_5570-cmpr.jpg', 'IMG_5571-cmpr.jpg', 'IMG_5572-cmpr.jpg', 'IMG_5573-cmpr.jpg'
        ];
        setImages(imageList);
        window.scrollTo(0, 0);
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
        <div className="full-gallery-page">
            <header className="gallery-page-header container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
                <div className="gallery-header-content">
                    <h1 className="gallery-title">Complete Villa Gallery</h1>
                    <p className="gallery-subtitle">Immerse yourself in every detail of VillaZuri</p>
                </div>
            </header>

            <section className="gallery-section">
                <div className="container gallery-container">
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
                    <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        <ChevronLeft size={40} />
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={`/villa pics/${images[currentImageIndex]}`} alt={`Villa view ${currentImageIndex + 1}`} />
                        <div className="lightbox-counter">{currentImageIndex + 1} / {images.length}</div>
                    </div>
                    <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                        <ChevronRight size={40} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FullGallery;
