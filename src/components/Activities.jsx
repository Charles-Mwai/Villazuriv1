import React from 'react';
import { Link } from 'react-router-dom';
import { activitiesData } from '../data/activitiesData';
import './SectionStyles.css';

const Activities = () => {
    return (
        <div className="features-section">
            <div className="container">
                <Link to="/blog" style={{ textDecoration: 'none' }}>
                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '5px', fontSize: '1.5rem', textTransform: 'none' }}>Wait, there is more!</h2>
                    <h3 className="activities-subheading" style={{ fontSize: '1.2rem', fontWeight: '400' }}>Things to do while you stay with us</h3>
                </Link>
                <div className="features-grid">
                    {activitiesData.map((item) => (
                        <div key={item.id} className="feature-item">
                            <Link to={`/activities/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="feature-image-wrapper">
                                    <img src={item.image} alt={item.title} className="feature-image" />
                                </div>
                                <h4>{item.title}</h4>
                            </Link>
                            <p className="feature-description">{item.description}</p>
                            <Link to={`/activities/${item.id}`} className="feature-arrow">
                                <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 10H118M118 10L110 3M118 10L110 17" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Activities;
