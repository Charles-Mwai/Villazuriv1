import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Camera, LayoutGrid, Maximize2 } from 'lucide-react';
import RevealOnScroll from '../../components/RevealOnScroll';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useBooking } from '../../context/BookingContext';
import './FullGallery.css';

const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'exterior', label: 'Exterior & View' },
    { id: 'living', label: 'Living Areas' },
    { id: 'bedrooms', label: 'Bedrooms' },
];

const FullGallery = () => {
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { openBooking } = useBooking();

    useEffect(() => {
        const imageList = [
            { src: 'IMG_5485-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5487-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5488-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5489-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5490-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5491-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5492-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5494-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5495-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5496-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5497-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5499-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5500-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5501-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5502-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5503-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5504-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5505-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5506-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5507-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5508-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5509-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5510-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5511-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5512-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5514-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5515-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5516-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5517-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5518-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5519-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5521-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5522-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5523-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5524-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5525-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5526-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5527-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5530-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5531-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5532-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5533-HDR-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5535-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5536-cmpr.jpg', cat: 'bedrooms' },
            { src: 'IMG_5538-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5539-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5541-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5543-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5545-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5546-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5547-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5548-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5550-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5551-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5552-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5553-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5554-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5555-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5556-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5557-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5558-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5559-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5560-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5561-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5562-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5563-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5564-cmpr.jpg', cat: 'exterior' },
            { src: 'IMG_5565-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5566-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5567-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5568-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5569-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5570-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5571-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5572-cmpr.jpg', cat: 'living' },
            { src: 'IMG_5573-cmpr.jpg', cat: 'living' }
        ];
        setImages(imageList);
        window.scrollTo(0, 0);
    }, []);

    const filteredImages = useMemo(() => {
        if (activeCategory === 'all') return images;
        return images.filter(img => img.cat === activeCategory);
    }, [activeCategory, images]);

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
        setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
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
    }, [lightboxOpen, filteredImages.length]);

    return (
        <div className="full-gallery-page">
            <Navbar />

            <header className="gallery-page-header container">
                <div className="gallery-header-content">
                    <RevealOnScroll>
                        <h1 className="gallery-title">Visual Discovery</h1>
                        <p className="gallery-subtitle">A curated collection of life at VillaZuri</p>
                    </RevealOnScroll>
                </div>

                <div className="filter-bar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </header>

            <section className="gallery-masonry-section container">
                <div className="masonry-grid">
                    {filteredImages.map((image, index) => (
                        <RevealOnScroll key={`${activeCategory}-${image.src}-${index}`}>
                            <div
                                className="masonry-item"
                                role="button"
                                tabIndex={0}
                                onClick={() => openLightbox(index)}
                                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                            >
                                <img
                                    src={`/villa pics/${image.src}`}
                                    alt={`Villa view ${index + 1}`}
                                    loading="lazy"
                                />
                                <div className="masonry-overlay">
                                    <Maximize2 size={24} color="#fff" strokeWidth={1.5} />
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </section>

            <section className="gallery-cta-section container">
                <RevealOnScroll>
                    <div className="cta-box">
                        <h2>Ready to experience this in person?</h2>
                        <p>Book your stay at VillaZuri and create your own memories.</p>
                        <button className="gallery-book-btn" onClick={openBooking}>Book Your Stay Now</button>
                    </div>
                </RevealOnScroll>
            </section>

            <Footer />

            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={32} />
                    </button>

                    <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        <ChevronLeft size={40} />
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`/villa pics/${filteredImages[currentImageIndex].src}`}
                            alt="Villa view"
                            className="lightbox-main-img"
                        />
                        <div className="lightbox-footer">
                            <span className="image-counter">{currentImageIndex + 1} / {filteredImages.length}</span>
                            <span className="image-category">{filteredImages[currentImageIndex].cat}</span>
                        </div>
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
