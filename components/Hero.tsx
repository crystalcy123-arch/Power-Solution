
import React from 'react';
import { UserLocation } from '../types';

interface HeroProps {
  onHomeClick: () => void;
  onSolarClick: () => void;
  location: UserLocation;
}

const Hero: React.FC<HeroProps> = ({ onHomeClick, onSolarClick, location }) => {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-50 to-sky-50 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
          Modern Living, Redefined: <br />
          Custom Garden Suites & Clean Energy
        </h1>
        
        <p className="max-w-4xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
          Creating independent, smart-enabled spaces for the ones you love. 
          We combine architectural excellence with solar-powered solutions to deliver 
          comfortable, eco-friendly homes for Ontario families.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            onClick={onHomeClick}
            className="w-full sm:w-auto px-10 py-5 bg-sky-500 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-2xl shadow-sky-200 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Design For My Home
          </button>
          
          <button 
            onClick={onSolarClick}
            className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            Solar Energy solution
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
