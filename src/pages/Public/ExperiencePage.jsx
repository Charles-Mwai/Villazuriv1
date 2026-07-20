import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, MapPin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import Slideshow from '../../components/Slideshow';
import LocationMap from '../../components/LocationMap';
import { useBooking } from '../../context/BookingContext';
import './ExperiencePage.css';
import '../Public/FullGallery.css';

// Gallery sections matching FullGallery.jsx — always kept in sync
const gallerySections = [
    {
        label: 'Living Room',
        images: [
            { src: '/Archive (3)/LIVING/IMG_9204.jpg', size: 'big' },
            { src: '/Archive (3)/LIVING/IMG_9206.jpg', size: 'tall' },
            { src: '/Archive (3)/LIVING/IMG_9210.jpg', size: 'normal' },
            { src: '/Archive (3)/LIVING/IMG_9349.jpg', size: 'wide' },
        ]
    },
    {
        label: 'Bedroom',
        images: [
            { src: '/Archive (3)/BEDROOM/IMG_9244.jpg', size: 'wide' },
            { src: '/Archive (3)/BEDROOM/IMG_9250.jpg', size: 'tall' },
            { src: '/Archive (3)/BEDROOM/IMG_9340.jpg', size: 'normal' },
            { src: '/Archive (3)/BEDROOM/IMG_9341.jpg', size: 'big' },
        ]
    },
    {
        label: 'Bathroom',
        images: [
            { src: '/Archive (3)/BATHROOM/IMG_9239.jpg', size: 'tall' },
            { src: '/Archive (3)/BATHROOM/IMG_9311.jpg', size: 'normal' },
            { src: '/Archive (3)/BATHROOM/IMG_9334.jpg', size: 'wide' },
            { src: '/Archive (3)/BATHROOM/IMG_9336.jpg', size: 'big' },
        ]
    },
    {
        label: 'Kitchen',
        images: [
            { src: '/Archive (3)/KITCHEN/IMG_9211.jpg', size: 'big' },
            { src: '/Archive (3)/KITCHEN/IMG_9292.jpg', size: 'normal' },
            { src: '/Archive (3)/KITCHEN/IMG_9300.jpg', size: 'tall' },
            { src: '/Archive (3)/KITCHEN/IMG_9301.jpg', size: 'wide' },
        ]
    },
    {
        label: 'Terrace',
        images: [
            { src: '/Archive (3)/TERRACE/IMG_5541-cmpr.jpg', size: 'wide' },
            { src: '/Archive (3)/TERRACE/IMG_9383.jpg', size: 'big' },
            { src: '/Archive (3)/TERRACE/IMG_9389.jpg', size: 'tall' },
            { src: '/Archive (3)/TERRACE/IMG_9399.jpg', size: 'normal' },
        ]
    },
    {
        label: 'Green',
        images: [
            { src: '/Archive (3)/GREEN/DJI_0671.jpg', size: 'big' },
            { src: '/Archive (3)/GREEN/IMG_9226.jpg', size: 'tall' },
            { src: '/Archive (3)/GREEN/IMG_9359.jpg', size: 'wide' },
            { src: '/Archive (3)/GREEN/IMG_9362.jpg', size: 'normal' },
        ]
    },
    {
        label: 'Decor',
        images: [
            { src: '/Archive (3)/DECOR/IMG_9231.jpg', size: 'normal' },
            { src: '/Archive (3)/DECOR/IMG_9235.jpg', size: 'wide' },
            { src: '/Archive (3)/DECOR/IMG_9295.jpg', size: 'tall' },
            { src: '/Archive (3)/DECOR/IMG_9408.jpg', size: 'big' },
        ]
    },
];

const ExperiencePage = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { isBookingOpen, openBooking, closeBooking } = useBooking();
    const [activeTab, setActiveTab] = useState('amenities');

    // Flatten all images across all sections into a single list for lightbox
    const allImages = useMemo(() =>
        gallerySections.flatMap(section =>
            section.images.map(img => ({ ...img, label: section.label }))
        ), []);

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
        window.scrollTo(0, 0);
    }, []);

    const openLightbox = (globalIndex) => {
        setCurrentImageIndex(globalIndex);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
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
    }, [lightboxOpen, allImages.length]);

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
                        <p className="subhead-text">A journey of luxury and serenity</p>
                        <p className="justified-text">
                            Villa Zuri is a superior 3-bedroom all ensuite villa located within the serene Papa Remo Village in Watamu, Kenya. With a stunning interior designed by the legendary Orietta Mosca,the villa features the largest private well manicured garden within a secure gated community surrounded with lush greenery. The villa offers a calm, secure, and family friendly environment perfect for relaxing and reconnecting with nature. Ideal for families or small groups seeking comfort, privacy and peaceful coastal gateway or play. The villa offers guests access to the famous Papa Remo private beach as well as the magical Seven Islands Beach.
                        </p>
                        <p className="justified-text">
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

            {/* Gallery Section - Synced with FullGallery */}
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
                    {(() => {
                        let runningIndex = 0;
                        return gallerySections.map((section) => {
                            const sectionStartIndex = runningIndex;
                            runningIndex += section.images.length;
                            return (
                                <section className="gallery-category-section" key={section.label}>
                                    <RevealOnScroll>
                                        <h2 className="gallery-section-title">{section.label}</h2>
                                    </RevealOnScroll>
                                    <div className="masonry-grid">
                                        {section.images.map((image, imgIndex) => {
                                            const globalIdx = sectionStartIndex + imgIndex;
                                            return (
                                                <RevealOnScroll key={`${section.label}-${imgIndex}`}>
                                                    <div
                                                        className={`masonry-item ${image.size}`}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => openLightbox(globalIdx)}
                                                        onKeyDown={(e) => e.key === 'Enter' && openLightbox(globalIdx)}
                                                    >
                                                        <img
                                                            src={image.src}
                                                            alt={`Villa Zuri ${section.label} - view ${imgIndex + 1}`}
                                                            loading="lazy"
                                                        />
                                                        <div className="masonry-overlay">
                                                            <Maximize2 size={24} color="#fff" strokeWidth={1.5} />
                                                        </div>
                                                    </div>
                                                </RevealOnScroll>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        });
                    })()}
                </main>
            </div>

            {/* Location Section */}
            <section className="experience-location-section">
                <div className="container">
                    <RevealOnScroll>
                        <div className="location-header text-center">
                            <MapPin size={32} className="location-icon" />
                            <h2>Location</h2>
                            <p>Find us in the heart of Watamu</p>
                        </div>
                    </RevealOnScroll>
                    <div className="location-map-wrapper">
                        <LocationMap center={{ lat: -3.3533, lng: 40.0158 }} zoom={15} />
                    </div>
                </div>
            </section>

            <Footer />

            {/* Lightbox Overlay */}
            {lightboxOpen && allImages.length > 0 && (
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
                            src={allImages[currentImageIndex].src}
                            alt={`Villa Zuri ${allImages[currentImageIndex].label} - detailed view`}
                            className="lightbox-main-img"
                            draggable="false"
                        />
                        <div className="lightbox-footer">
                            <span className="image-counter">{currentImageIndex + 1} / {allImages.length}</span>
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
