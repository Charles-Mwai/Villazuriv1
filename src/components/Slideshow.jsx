import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = ({ images, interval = 4000, ariaLabel = "Image slideshow" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images, interval]);

    if (!images || images.length === 0) return null;

    return (
        <div className="slideshow-container" aria-label={ariaLabel}>
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url("${img}")` }}
                    aria-label={`${ariaLabel} - view ${index + 1}`}
                    role="img"
                />
            ))}
        </div>
    );
};

export default Slideshow;
