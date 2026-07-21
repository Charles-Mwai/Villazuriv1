import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Play } from 'lucide-react';
import RevealOnScroll from '../../components/RevealOnScroll';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useBooking } from '../../context/BookingContext';
import './FullGallery.css';

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
        label: 'Pool',
        images: [
            { src: '/Archive (3)/POOL/DJI_0673.jpg', size: 'big' },
            { src: '/Archive (3)/POOL/DJI_0674.jpg', size: 'wide' },
            { src: '/Archive (3)/POOL/DJI_0689.jpg', size: 'tall' },
            { src: '/Archive (3)/POOL/IMG_9371.jpg', size: 'normal' },
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

const videos = [
    { src: 'WhatsApp Video 2026-02-01 at 18.14.15.mp4', size: 'wide', type: 'video' },
    { src: 'WhatsApp Video 2026-02-01 at 18.14.16.mp4', size: 'normal', type: 'video' },
    { src: 'WhatsApp Video 2026-02-04.mp4', size: 'normal', type: 'video' },
];

const FullGallery = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { openBooking } = useBooking();

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
        if (distance > minSwipeDistance) nextImage();
        else if (distance < -minSwipeDistance) prevImage();
    };

    // Flatten all images across all sections into a single list for lightbox
    const allImages = useMemo(() =>
        gallerySections.flatMap(section =>
            section.images.map(img => ({ ...img, type: 'image' }))
        ), []);

    // Build a flat lightbox media list: all images then all videos
    const allMedia = useMemo(() => [
        ...allImages,
        ...videos,
    ], [allImages]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openLightbox = (globalIndex) => {
        setCurrentIndex(globalIndex);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % allMedia.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
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
    }, [lightboxOpen, allMedia.length]);

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

    // Track running image count across sections for global index calculation
    let runningIndex = 0;

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
                    {gallerySections.map((section) => {
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
                                                        onError={(e) => {
                                                            // Hide broken images gracefully (e.g. pool photos not yet uploaded)
                                                            const wrapper = e.target.closest('.masonry-item');
                                                            if (wrapper) {
                                                                wrapper.classList.add('pool-coming-soon');
                                                                e.target.style.display = 'none';
                                                            }
                                                        }}
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
                    })}

                    {/* Video Section */}
                    <section className="gallery-category-section">
                        <RevealOnScroll>
                            <h2 className="gallery-section-title">Videos</h2>
                        </RevealOnScroll>
                        <div className="masonry-grid">
                            {videos.map((video, index) => {
                                const globalIdx = allImages.length + index;
                                return (
                                    <RevealOnScroll key={`video-${index}`}>
                                        <div
                                            className={`masonry-item ${video.size}`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => openLightbox(globalIdx)}
                                            onKeyDown={(e) => e.key === 'Enter' && openLightbox(globalIdx)}
                                        >
                                            <video
                                                src={`/Videos/${video.src}`}
                                                muted
                                                loop
                                                playsInline
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                            <div className="masonry-overlay video-overlay">
                                                <Play size={32} color="#fff" strokeWidth={1.5} fill="#fff" />
                                            </div>
                                        </div>
                                    </RevealOnScroll>
                                );
                            })}
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
                        {allMedia[currentIndex]?.type === 'image' ? (
                            <img
                                src={allMedia[currentIndex]?.src}
                                alt={`Villa Zuri detailed view ${currentIndex + 1}`}
                                className="lightbox-main-img"
                                draggable="false"
                            />
                        ) : allMedia[currentIndex]?.type === 'video' ? (
                            <video
                                src={`/Videos/${allMedia[currentIndex]?.src}`}
                                className="lightbox-main-img"
                                controls
                                autoPlay
                                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                            />
                        ) : null}
                        <div className="lightbox-footer">
                            <span className="image-counter">
                                {currentIndex + 1} / {allMedia.length}
                            </span>
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
