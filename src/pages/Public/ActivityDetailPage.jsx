import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { activitiesData } from '../../data/activitiesData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import './ActivityDetailPage.css';

const ActivityDetailPage = () => {
    const { id } = useParams();
    const activity = activitiesData.find(a => a.id === id);

    // Filter out the current activity for the "Explore More" section
    const otherActivities = activitiesData.filter(a => a.id !== id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!activity) {
        return (
            <div className="error-page">
                <Navbar />
                <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <h2>Activity not found</h2>
                    <Link to="/">Back to Home</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="activity-detail-page">
            <Navbar />

            {/* Main Content */}
            <section className="activity-main-section">
                <div className="container">
                    <RevealOnScroll>
                        <div className="activity-layout">
                            <div className="activity-image-container">
                                <img src={activity.image} alt={activity.title} className="main-activity-image" />
                            </div>
                            <div className="activity-text-content">
                                <h1>{activity.title}</h1>
                                <div className="activity-description">
                                    {activity.fullContent.split('\n\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph.trim()}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Explore More Section */}
            <section className="explore-more-section">
                <div className="container">
                    <RevealOnScroll>
                        <h2 className="explore-title">Other things to do</h2>
                    </RevealOnScroll>
                    <div className="activities-mini-grid">
                        {otherActivities.map((item) => (
                            <RevealOnScroll key={item.id}>
                                <div className="activity-mini-card">
                                    <Link to={`/activities/${item.id}`} className="card-link">
                                        <div className="mini-image-wrapper">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <div className="mini-card-info">
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                            <span className="read-more-sm">READ MORE →</span>
                                        </div>
                                    </Link>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ActivityDetailPage;
