import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Blog.css';

const Blog = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-page">
            <Navbar />

            <header className="blog-hero">
                <h1>About Watamu</h1>
            </header>

            <main className="blog-content">
                <article className="blog-post">
                    <h2>Where Coastal Luxury Meets Endless Experiences</h2>
                    <p className="lead-text">
                        Tucked away along Kenya’s stunning Indian Ocean coastline, Villa Zuri offers a refined retreat in the heart of Watamu, one of the country’s most enchanting coastal destinations. Surrounded by natural beauty, rich Swahili heritage, and the calming rhythm of the ocean, Villa Zuri is the perfect place to unwind while staying close to unforgettable experiences.
                    </p>

                    <h3>Ocean Adventures Just Moments Away</h3>
                    <p>
                        From Villa Zuri, the wonders of the sea are always within reach. The nearby Watamu Marine National Park invites guests to explore vibrant coral reefs and crystal-clear waters teeming with tropical fish, sea turtles, and graceful rays. Snorkeling and scuba diving here are world-class, offering serene yet colorful underwater encounters.
                    </p>
                    <p>
                        Spend leisurely days along Watamu Beach and Turtle Bay, where soft white sands and warm, shallow waters create an ideal setting for swimming, sunbathing, or quiet reflection by the ocean.
                    </p>
                    <p>
                        As evening approaches, a traditional sunset dhow cruise offers a timeless coastal experience. Gliding along the shoreline as the sky glows with sunset hues is a beautiful way to end the day before returning to the comfort of Villa Zuri.
                    </p>
                    <p>
                        For guests seeking excitement, Watamu also offers deep-sea fishing, kayaking, paddleboarding, and kite surfing—all easily arranged during your stay.
                    </p>

                    <h3>Tranquil Nature Beyond the Villa</h3>
                    <p>
                        Beyond the beach, Watamu reveals a softer, greener side. Mida Creek, a peaceful mangrove ecosystem, is perfect for kayaking, birdwatching, or guided boat tours through calm tidal waters. It’s a serene escape where nature feels untouched and time slows down.
                    </p>
                    <p>
                        A short drive away, Arabuko-Sokoke Forest offers shaded walking trails and rare wildlife sightings, including elephants, antelopes, butterflies, and unique bird species found nowhere else in the world.
                    </p>

                    <h3>Culture, History & Authentic Coastal Life</h3>
                    <p>
                        Watamu’s rich past comes alive at the Gede Ruins, an ancient Swahili town hidden within the forest. Wandering through its stone structures and quiet courtyards offers a glimpse into centuries-old coastal trade and culture.
                    </p>
                    <p>
                        Guests can also visit the Bio-Ken Snake Farm for an educational look at reptile conservation or explore local markets to experience everyday Swahili life—from handcrafted items to fresh seafood and coconut-infused coastal cuisine.
                    </p>

                    <h3>Experiences That Stay With You</h3>
                    <p>
                        Staying at Villa Zuri means being close to experiences that truly matter. Witness sea turtle conservation efforts, including the release of hatchlings into the ocean, or take a private boat trip to nearby sandbanks and islands for secluded swims and peaceful moments at sea.
                    </p>
                    <p>
                        For a deeper cultural connection, Swahili cooking experiences offer a chance to learn traditional recipes and flavors that define Kenya’s coast.
                    </p>

                    <div className="blog-footer">
                        <p>
                            <strong>Villa Zuri is more than a villa—it’s your gateway to Watamu.</strong>
                        </p>
                        <p>
                            A place where luxury, privacy, and authentic coastal experiences come together, creating a stay defined by calm mornings, sun-filled days, and unforgettable memories by the sea.
                        </p>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
