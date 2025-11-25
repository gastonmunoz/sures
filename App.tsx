import React from 'react';
import { HashRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Catalog from './components/Catalog';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import SmartAdvisor from './components/SmartAdvisor';
import WhatsAppFloat from './components/WhatsAppFloat';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-gray-900 selection:bg-sures-primary selection:text-white">
        <Navbar />
        
        <main className="relative z-0">
          <div id="home">
            <Hero />
          </div>
          
          <div id="about">
            <About />
          </div>
          
          <div id="services">
            <Services />
          </div>
          
          <div id="catalog">
            <Catalog />
          </div>
          
          <div id="advisor">
            <SmartAdvisor />
          </div>
          
          <div id="contact">
            <Contact />
          </div>
        </main>

        <Footer />
        
        {/* Persistent Floating Buttons */}
        <WhatsAppFloat />
        <ChatWidget />
      </div>
    </HashRouter>
  );
};

export default App;