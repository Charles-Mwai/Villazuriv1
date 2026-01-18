import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import RevealOnScroll from '../../components/RevealOnScroll';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useBooking } from '../../context/BookingContext';
import './FullGallery.css';



const FullGallery = () => {
    const [images, setImages] = useState([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { openBooking } = useBooking();

    // Swipe handlers
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // the required distance between touchStart and touchEnd to be considered a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null); // otherwise the swipe is fired even with very small hacks
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextImage();
        } else if (isRightSwipe) {
            prevImage();
        }
    };

    useEffect(() => {
        const masonryImages = [
            { src: 'IMG_3819.jpg', size: 'big' },       // 2x2 Feature
            { src: 'IMG_5485-cmpr.jpg', size: 'tall' }, // 1x2 Vertical
            { src: 'IMG_5503-cmpr.jpeg', size: 'normal' },
            { src: 'IMG_5507.jpg', size: 'wide' },      // 2x1 Horizontal
            { src: 'IMG_5514-cmpr.jpeg', size: 'normal' },
            { src: 'IMG_5518.jpg', size: 'tall' },
            { src: 'IMG_5525-cmpr.jpeg', size: 'normal' },
            { src: 'IMG_5535.jpg', size: 'wide' },
            { src: 'IMG_5539.jpg', size: 'normal' },
            { src: 'IMG_5545-cmpr.jpeg', size: 'big' },  // 2x2 Feature
            { src: 'IMG_5565.jpg', size: 'tall' },
            { src: 'WhatsApp Image 2026-01-07 at 13.16.51 (1).jpg', size: 'wide' }
        ];
        setImages(masonryImages);
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

    const [activeTab, setActiveTab] = useState('amenities');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'amenities':
                return (
                    <ul className="details-list">
                        <li>Swimming Pool</li>
                        <li>24-hour Butler Service</li>
                        <li>Private Garden</li>
                        <li>Air-conditioning</li>
                        <li>Mosquito nets</li>
                        <li>Safe and minibar</li>
                        <li>Wireless Internet Access</li>
                    </ul>
                );
            case 'includes':
                return (
                    <ul className="details-list">
                        <li>Full board accommodation</li>
                        <li>Soft drinks, beers, wines</li>
                        <li>Laundry service</li>
                        <li>Airstrip transfers</li>
                    </ul>
                );
            default:
                return null;
        }
    };

    return (
        <div className="full-gallery-page">
            <Navbar />

            <div className="gallery-split-layout container">
                {/* Left Sticky Sidebar */}
                <aside className="gallery-sidebar">
                    <RevealOnScroll>
                        <div className="tabs-nav">
                            <button
                                className={`tab-btn ${activeTab === 'amenities' ? 'active' : ''}`}
                                onClick={() => setActiveTab('amenities')}
                            >
                                AMENITIES
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'includes' ? 'active' : ''}`}
                                onClick={() => setActiveTab('includes')}
                            >
                                INCLUDES
                            </button>

                        </div>

                        <div className="tab-content">
                            {renderTabContent()}
                        </div>

                        <div className="sidebar-cta">
                            <button className="book-link-btn" onClick={openBooking}>BOOK</button>
                        </div>
                    </RevealOnScroll>
                </aside>

                {/* Right Scrollable Content */}
                <main className="gallery-main-content">
                    <section className="gallery-masonry-section">
                        <div className="masonry-grid">
                            {images.map((image, index) => (
                                <RevealOnScroll key={`masonry-${image.src}-${index}`}>
                                    <div
                                        className={`masonry-item ${image.size}`}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => openLightbox(index)}
                                        onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                                    >
                                        <img
                                            src={`/Bento Grid/${image.src}`}
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
                </main>
            </div>

            <Footer />

            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={32} />
                    </button>

                    <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        <ChevronLeft size={40} />
                    </button>

                    <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={`/Bento Grid/${images[currentImageIndex].src}`}
                            alt="Villa bento view"
                            className="lightbox-main-img"
                            draggable="false"
                        />
                        <div className="lightbox-footer">
                            <span className="image-counter">{currentImageIndex + 1} / {images.length}</span>
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
