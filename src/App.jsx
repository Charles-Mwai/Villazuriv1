import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import VillaDetails from './components/VillaDetails';
import Dining from './components/Dining';
import Footer from './components/Footer';

function App() {
    return (
        <div className="app">
            <Navbar />
            <Hero />
            <Experience />
            <VillaDetails />
            <Dining />
            <Footer />
        </div>
    );
}

export default App;
