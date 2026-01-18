import React from 'react';
import { Link } from 'react-router-dom';
import { activitiesData } from '../data/activitiesData';
import './SectionStyles.css';

const Activities = () => {
    return (
        <div className="features-section">
            <div className="container">
                <Link to="/blog" style={{ textDecoration: 'none' }}>
                    <h3 className="activities-subheading">Things to do while you stay with us</h3>
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
                            <Link to={`/activities/${item.id}`} className="activity-link">Read More</Link>
                            <p className="feature-description">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Activities;
