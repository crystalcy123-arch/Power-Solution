
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ADUSection from './components/ADUSection';
import SolarSection from './components/SolarSection';
import Footer from './components/Footer';
import { detectLocation } from './services/locationService';
import { UserLocation, MainCategory } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainCategory>('home');
  const [location, setLocation] = useState<UserLocation>({
    city: 'Detecting...',
    region: 'ON',
    country: 'Canada',
    isDetected: false
  });

  useEffect(() => {
    detectLocation().then((loc) => {
      if (loc.country === 'Canada' || !loc.isDetected) {
        setLocation({ ...loc, country: 'Canada', region: loc.region || 'ON' });
      } else {
        setLocation(loc);
      }
    });
  }, []);

  const scrollToConfig = () => {
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHomeCta = () => {
    setActiveTab('home');
    scrollToConfig();
  };

  const handleSolarCta = () => {
    setActiveTab('solar');
    scrollToConfig();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero 
          location={location}
          onHomeClick={handleHomeCta}
          onSolarClick={handleSolarCta}
        />
        
        <div id="configurator" className="pt-20 pb-32 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4">
            {activeTab === 'home' && <ADUSection location={location} />}
            {activeTab === 'solar' && <SolarSection location={location} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
