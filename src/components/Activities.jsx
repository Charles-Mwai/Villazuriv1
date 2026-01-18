import React from 'react';
import { Link } from 'react-router-dom';
import './SectionStyles.css';

const activities = [
    {
        title: 'Dolphin Watching',
        image: '/Activities/activity-1.jpg',
        description: 'Watch playful dolphins glide through Watamu’s warm waters.'
    },
    {
        title: 'Dhow Cruise',
        image: '/Activities/activity-2.jpg',
        description: 'Sail at sunset on a traditional dhow along Watamu’s calm waters'
    },
    {
        title: 'Dining',
        image: '/Activities/activity-3.jpg',
        description: 'Enjoy fresh seafood and Swahili flavors at Watamu’s beachfront restaurants'
    },
    {
        title: 'Marine Park',
        image: '/Activities/activity-4.jpg',
        description: 'Explore vibrant coral reefs and marine life in Watamu Marine Park'
    }
];

const Activities = () => {
    return (
        <div className="features-section">
            <div className="container">
                <Link to="/blog" style={{ textDecoration: 'none' }}>
                    <h3 className="activities-subheading">Things to do while you stay with us</h3>
                </Link>
                <div className="features-grid">
                    {activities.map((item, index) => (
                        <div key={index} className="feature-item">
                            <div className="feature-image-wrapper">
                                <img src={item.image} alt={item.title} className="feature-image" />
                            </div>
                            <h4>{item.title}</h4>
                            <Link to="/blog" className="activity-link">Read More</Link>
                            <p className="feature-description">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Activities;
