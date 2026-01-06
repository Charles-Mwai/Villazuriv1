import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import VillaDetails from './components/VillaDetails';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
    return (
        <div className="app">
            <Navbar />
            <Hero />
            <Experience />
            <VillaDetails />
            <Gallery />
            <Footer />
        </div>
    );
}

export default App;
