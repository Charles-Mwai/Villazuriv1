import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import Slideshow from '../../components/Slideshow';
import { useBooking } from '../../context/BookingContext';
import './ExperiencePage.css';
import '../Public/FullGallery.css';

const ExperiencePage = () => {
    const [images, setImages] = useState([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { isBookingOpen, openBooking, closeBooking } = useBooking();
    const [activeTab, setActiveTab] = useState('amenities');

    // Swipe handlers
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
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
            { src: 'IMG_3819.jpg', size: 'big' },
            { src: 'IMG_5485-cmpr.jpg', size: 'tall' },
            { src: 'IMG_5503-cmpr.jpeg', size: 'normal' },
            { src: 'IMG_5507.jpg', size: 'wide' },
            { src: 'IMG_5514-cmpr.jpeg', size: 'normal' },
            { src: 'IMG_5518.jpg', size: 'tall' },
            { src: 'IMG_5525-cmpr.jpeg', size: 'normal' },
            { src: 'IMG_5535.jpg', size: 'wide' },
            { src: 'IMG_5539.jpg', size: 'normal' },
            { src: 'IMG_5545-cmpr.jpeg', size: 'big' },
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
        <div className="experience-page">
            <Navbar />

            {/* Hero Section */}
            <section className="experience-hero">
                <div className="experience-hero-overlay">
                    {/* Title removed per user request */}
                </div>
            </section>

            {/* Intro Content - White Background */}
            <section className="experience-intro container">
                <RevealOnScroll>
                    <div className="intro-text">
                        <h2>Our Story</h2>
                        <p>
                            Villa Zuri is a superior 3-bedroom all ensuite villa located within the serene Papa Remo Village in Watamu, Kenya. With a stunning interior designed by the legendary Orietta Mosca,the villa features the largest private well manicured garden within a secure gated community surrounded with lush greenery. The villa offers a calm, secure, and family friendly environment perfect for relaxing and reconnecting with nature. Ideal for families or small groups seeking comfort, privacy and peaceful coastal gateway or play. The villa offers guests access to the famous Papa Remo private beach as well as the magical Seven Islands Beach.
                        </p>
                        <p>
                            The location is positioned as the most sought after within Watamu considering its centrality to most of the major tourist attractions including various restaurants and hotels eg Tamu Restaurant, Ocean Sports ,amazing Seven Islands, Papa Remo Beach known for its white sands and amazing parties. For nature lovers, there is the nature trails, a snake park, sun set viewing locations like Litchaus etc
                        </p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* Zig-Zag Sections */}
            <div className="experience-sections">
                {/* Activities: Text Left, Image Right */}
                <section className="content-split-section">
                    <div className="container split-container">
                        <RevealOnScroll>
                            <div className="split-content text-left">
                                <h3>Activities</h3>


                                <p>
                                    During your stay at Villa Zuri, you can easily enjoy Watamu’s most loved experiences—from watching dolphins in the warm ocean waters to sailing at sunset on a traditional dhow. Explore the vibrant marine life of Watamu Marine Park, then unwind with fresh seafood and Swahili flavors at the area’s beachfront restaurants.
                                </p>
                                {/* Link removed per user request */}
                            </div>
                        </RevealOnScroll>
                        <div className="split-image">
                            <Slideshow
                                images={[
                                    '/Activities/activity-1.jpg',
                                    '/Activities/activity-2.jpg',
                                    '/Activities/activity-3.jpg',
                                    '/Activities/activity-4.jpg'
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* Service: Image Left, Text Right */}
                <section className="content-split-section reverse-mobile">
                    <div className="container split-container reverse-layout">
                        <RevealOnScroll>
                            <div className="split-content text-left">
                                <h3>Service</h3>
                                <p>
                                    Along with the dedicated Villa Zuri team, we offer the highest standard of privacy and concierge service. Expect a sophisticated yet discreet 24/7 presence of staff and bespoke in-villa experiences such as romantic dinners, sundowners, and curated cuisine experiences.
                                </p>
                                <p>
                                    Complimentary child-minding services are also offered to allow parents much-deserved downtime, while we also offer a range of family activities that can be enjoyed together.
                                </p>
                            </div>
                        </RevealOnScroll>
                        <div className="split-image">
                            <img src="/IMG_5515-cmpr.jpg" alt="Private dining on the beach" />
                        </div>
                    </div>
                </section>
            </div>

            {/* Gallery Section - Copied from FullGallery */}
            <div className="gallery-split-layout integrated-gallery container">

                {/* Left Sticky Sidebar */}
                <aside className="gallery-sidebar" style={{ paddingTop: '0' }}>
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

            {/* Lightbox Overlay */}
            {lightboxOpen && images.length > 0 && (
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

export default ExperiencePage;
