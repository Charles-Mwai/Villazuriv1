import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storiesData } from '../../data/storiesData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RevealOnScroll from '../../components/RevealOnScroll';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
    const { id } = useParams();
    const story = storiesData.find(s => s.id === id);

    // Filter out the current story for the "Other Stories" section
    const otherStories = storiesData.filter(s => s.id !== id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!story) {
        return (
            <div className="error-page">
                <Navbar />
                <div className="container" style={{ padding: '160px 20px', textAlign: 'center' }}>
                    <h2>Story not found</h2>
                    <Link to="/blog" style={{ color: '#264D52', textDecoration: 'underline' }}>Back to Blog</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="story-detail-page">
            <Navbar />

            {/* Main Content */}
            <section className="story-main-section">
                <div className="container">
                    <RevealOnScroll>
                        <div className="story-layout">
                            <div className="story-image-container">
                                <img src={story.image} alt={story.title} className="main-story-image" />
                            </div>
                            <div className="story-text-content">
                                <h1>{story.title}</h1>
                                <div className="story-description">
                                    {story.fullContent.split('\n\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph.trim()}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Other Stories Section */}
            <section className="other-stories-section">
                <div className="container">
                    <RevealOnScroll>
                        <h2 className="explore-title">Other stories</h2>
                    </RevealOnScroll>
                    <div className="stories-mini-grid">
                        {otherStories.map((item) => (
                            <RevealOnScroll key={item.id}>
                                <div className="story-mini-card">
                                    <Link to={`/stories/${item.id}`} className="card-link">
                                        <div className="mini-image-wrapper">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <div className="mini-card-info">
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                            <span className="read-more-link">READ MORE →</span>
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

export default StoryDetailPage;
