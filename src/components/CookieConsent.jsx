import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-banner">
            <div className="cookie-content">
                <p>
                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                    <a href="/privacy" className="cookie-policy-link">Learn more</a>
                </p>
                <div className="cookie-actions">
                    <button onClick={handleAccept} className="accept-cookies-btn">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
