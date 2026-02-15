
import React, { useState, useMemo, useEffect } from 'react';
import { getADUConsultation } from '../services/geminiService';
import { ADUConfig, AIResponse, UserLocation } from '../types';
import { regionalKnowledge } from '../data/businessKnowledge';

interface ADUSectionProps {
  location: UserLocation;
}

const ADUSection: React.FC<ADUSectionProps> = ({ location }) => {
  const [config, setConfig] = useState<ADUConfig>({
    size: 'studio',
    intendedUse: 'rental',
    addons: {
      energyIndependence: false,
      smartSecurity: false,
      carbonNeutral: false,
      zonalComfort: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [openHighlight, setOpenHighlight] = useState<number | null>(null);

  const activeRegion = useMemo(() => {
    return location.region in regionalKnowledge ? location.region : 'ON';
  }, [location.region]);

  const rentalIncome = useMemo(() => {
    const pricing = regionalKnowledge[activeRegion].aduPricing;
    switch (config.size) {
      case 'studio': return pricing.studio.rentalEstimate;
      case '1-bedroom': return pricing.oneBed.rentalEstimate;
      case '2-bedroom': return pricing.twoBed.rentalEstimate;
      default: return '$0';
    }
  }, [config.size, activeRegion]);

  const basePrice = useMemo(() => {
    const pricing = regionalKnowledge[activeRegion].aduPricing;
    switch (config.size) {
      case 'studio': return pricing.studio.basePrice;
      case '1-bedroom': return pricing.oneBed.basePrice;
      case '2-bedroom': return pricing.twoBed.basePrice;
      default: return '$0';
    }
  }, [config.size, activeRegion]);

  const policyLink = useMemo(() => {
    return (regionalKnowledge[activeRegion] || regionalKnowledge['Default']).policyUrl;
  }, [activeRegion]);

  useEffect(() => {
    const fetchSpecs = async () => {
      setLoading(true);
      try {
        const res = await getADUConsultation(config, location);
        setResult(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecs();
  }, [config.size, config.addons]);

  const toggleAddon = (key: keyof ADUConfig['addons']) => {
    setConfig(prev => ({
      ...prev,
      addons: {
        ...prev.addons,
        [key]: !prev.addons[key]
      }
    }));
  };

  const highlights = [
    {
      title: "1. Built Better, Built Faster (The Smart Shell)",
      intro: "Forget traditional \"sticks and bricks.\" We use an advanced Structural Panel System that acts like a high-performance cooler for your home.",
      specs: [
        { label: "Maximum Warmth", text: "It keeps heat in during Ontario winters and out during the summer, far exceeding standard building rules." },
        { label: "Lower Bills", text: "Our precision-sealed walls reduce energy leaks by up to 40%, so you aren't paying to heat the outdoors." },
        { label: "Quiet & Quick", text: "We build the main structure in just a few days, so you can start renting it out (or moving in) much sooner." }
      ]
    },
    {
      title: "2. The Hybrid Comfort System",
      intro: "We use a \"two-stage\" approach to keeping you comfortable—combining power with precision.",
      specs: [
        { label: "The Workhorse", text: "A high-efficiency heat pump does the heavy lifting, keeping the air perfect year-round." },
        { label: "The Luxury", text: "We add Heated Floors in bathrooms and living areas for that cozy, silent warmth that feels premium." },
        { label: "Smart Design", text: "You get the most efficient heating for the lowest possible cost." }
      ]
    },
    {
      title: "3. A Roof That Works for You",
      intro: "Our signature \"Mono-Slope\" roof isn't just for looks—it’s the engine of the house.",
      specs: [
        { label: "Sun-Powered", text: "Sloped at the perfect angle for the Niagara region to catch every bit of sunlight for your solar panels." },
        { label: "Hidden Tech", text: "We tucked the \"clunky\" mechanical gear into the roof space, so you get more living room and higher ceilings." },
        { label: "Modern Aesthetic", text: "A sleek, vaulted design that makes even a small space feel like a luxury penthouse." }
      ]
    },
    {
      title: "4. The Net-Zero Standard",
      intro: "This is the gold standard of modern living. A Net-Zero home produces as much energy as it uses over a year.",
      specs: [
        { label: "Energy Independence", text: "Say goodbye to rising hydro rates—your home powers itself." },
        { label: "High Resale Value", text: "Buyers in the next decade will demand eco-friendly homes. Your ADU is already built for the future." }
      ]
    }
  ];

  const addonOptions = [
    {
      key: 'energyIndependence' as const,
      label: 'Net-Zero Energy Bundle',
      description: 'Integrated solar tiles and high-capacity battery storage for zero-dollar hydro bills and total power backup.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    },
    {
      key: 'zonalComfort' as const,
      label: 'Luxury Radiant Heating',
      description: 'Ultra-thin floor heating for silent, zone-controlled warmth in bathrooms and living areas.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" />
        </svg>
      )
    },
    {
      key: 'smartSecurity' as const,
      label: 'Whole-Home Intelligence',
      description: 'Integrated security with facial recognition, plus smart lighting and climate control at your fingertips.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const currentImage = config.size === 'studio' ? 'F1.png' : 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200';

  const renderRentalPrice = (price: string) => {
    if (price.includes('-')) {
      const parts = price.split('-');
      return (
        <div className="text-right flex flex-col items-end">
          <span className="text-4xl md:text-5xl font-black text-white leading-none mb-1">
            {parts[0].trim()} -
          </span>
          <span className="text-4xl md:text-5xl font-black text-white leading-none">
            {parts[1].trim()} <span className="text-2xl md:text-3xl">CAD</span>
          </span>
        </div>
      );
    }
    return (
      <span className="text-4xl md:text-5xl font-black text-white block leading-tight">
        {price} <span className="text-3xl md:text-4xl">CAD</span>
      </span>
    );
  };

  const handleImageContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <section className="max-w-7xl mx-auto px-4">
      {isEnlarged && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setIsEnlarged(false)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
            onClick={() => setIsEnlarged(false)}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={currentImage} 
            alt="Enlarged View" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none"
            onContextMenu={handleImageContextMenu}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1200';
            }}
          />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-6">
              Unlock the Full Potential of Your Backyard
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We configure your affordable and high-performance ADU with solar energy solution and smart-tech options.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full opacity-50"></div>
            
            <div className="relative z-10">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Design Framework</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'studio', label: 'Studio' },
                  { id: '1-bedroom', label: '1 Bed' },
                  { id: '2-bedroom', label: '2 Bed' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setConfig({ ...config, size: s.id as any })}
                    className={`py-8 px-2 text-center rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                      config.size === s.id ? 'bg-sky-500 border-sky-500 text-white font-bold shadow-lg shadow-sky-200' : 'border-slate-100 hover:border-slate-300 text-slate-600 bg-slate-50'
                    }`}
                  >
                    <span className="text-lg block">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0f172a] p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between shadow-2xl relative">
              <div className="flex items-center space-x-6 w-full md:w-auto mb-6 md:mb-0">
                <div className="w-[84px] h-[112px] bg-[#0ea5e9] rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(14,165,233,0.25)]">
                   <div className="w-12 h-12 rounded-full border-[3px] border-white/90 flex items-center justify-center">
                     <span className="text-2xl font-black">$</span>
                   </div>
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#38bdf8] uppercase tracking-[0.12em] block mb-1">
                    {location.city.toUpperCase()} MARKET RENTAL
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-white leading-tight block">
                    Monthly Rental<br />Income
                  </span>
                </div>
              </div>
              <div className="w-full md:w-auto">
                {renderRentalPrice(rentalIncome)}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Optional Smart-Tech Add-ons</label>
              <div className="space-y-3">
                {addonOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => toggleAddon(opt.key)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center space-x-4 text-left group ${
                      config.addons[opt.key] ? 'bg-sky-50 border-sky-500' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${config.addons[opt.key] ? 'bg-sky-500 text-white' : 'bg-white text-slate-400'}`}>
                      {opt.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-black text-slate-900 leading-none mb-1">{opt.label}</div>
                      <div className="text-xs text-slate-500">{opt.description}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${config.addons[opt.key] ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 bg-white'}`}>
                       {config.addons[opt.key] && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-center text-slate-400 text-sm font-medium">Add-ons are selected separately from the base structure price.</p>
          </div>

          {/* Government Funding Opportunities Section - Specific to Province */}
          <div className="bg-[#0f172a] border border-sky-500/30 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
            <div className="flex items-start space-x-6 relative z-10">
              <div className="mt-1 flex-shrink-0 w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 border border-sky-500/20 shadow-inner">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </div>
              <div className="flex-grow">
                <h5 className="text-xl font-bold text-white mb-2 font-heading">Government Funding Opportunities</h5>
                <p className="text-slate-300 leading-relaxed mb-6">Your project in <span className="text-sky-400 font-bold">{location.region === 'ON' ? 'Ontario' : (location.region === 'BC' ? 'British Columbia' : location.region)}</span> may qualify for provincial grants for secondary suites.</p>
                <a href={policyLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-black text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest border-b-2 border-sky-400/30 pb-1 group/link">
                  View on Policy 
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-[#0f172a] text-white p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col sticky top-24 border border-slate-800">
            <div className="flex-grow space-y-6">
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-200/20 bg-white p-2 shadow-2xl relative group min-h-[300px] flex items-center justify-center cursor-zoom-in" onClick={() => setIsEnlarged(true)}>
                <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Click to Enlarge</span>
                </div>
                <img 
                  src={currentImage} 
                  alt="Framework View" 
                  className={`w-full h-auto max-h-[450px] object-contain rounded-[2rem] bg-white transition-opacity duration-500 select-none ${config.size !== 'studio' ? 'aspect-[4/3] object-cover opacity-70' : ''}`} 
                  onContextMenu={handleImageContextMenu}
                  draggable={false}
                />
              </div>

              {/* Updated Engineering Highlights Section */}
              <div className="space-y-4 mt-8">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">The Engineering Behind Your Extra Income</h3>
                  <p className="text-[10px] font-bold text-sky-500/80 uppercase tracking-widest italic">High-tech construction that pays for itself.</p>
                </div>
                
                {highlights.map((h, idx) => (
                  <div key={idx} className="bg-slate-800/20 rounded-2xl border border-slate-800/50 overflow-hidden">
                    <div className="p-5">
                      <h4 className="text-sm font-black text-sky-400 mb-2">{h.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{h.intro}</p>
                      
                      <button 
                        onClick={() => setOpenHighlight(openHighlight === idx ? null : idx)}
                        className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors py-2 px-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <span>{openHighlight === idx ? 'Close Details' : 'Drop for Specs'}</span>
                        <svg className={`w-3 h-3 transition-transform duration-300 ${openHighlight === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className={`transition-all duration-500 ease-in-out ${openHighlight === idx ? 'max-h-[500px] border-t border-slate-800 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-5 bg-slate-900/40 space-y-4">
                        {h.specs.map((s, sIdx) => (
                          <div key={sIdx} className="space-y-1">
                            <div className="text-[10px] font-black uppercase text-sky-500/80 tracking-widest">{s.label}</div>
                            <p className="text-xs text-slate-300 leading-relaxed italic">{s.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-auto pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
              <div className="flex-1">
                <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">Base Project Estimate</div>
                <div className="text-4xl font-black text-white leading-tight">
                  {basePrice} <span className="text-xl text-sky-500 font-bold ml-1">CAD</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-4 leading-relaxed max-w-sm font-medium">
                  Includes full SIP structural shell, mono-slope architecture, and standard installation. <span className="text-sky-400 font-bold">Note: This estimate does not include potential government grants or funding.</span>
                </p>
              </div>
              <button className="whitespace-nowrap px-10 py-6 bg-sky-500 text-white rounded-[1.5rem] font-black text-lg hover:bg-sky-600 transition-all shadow-xl hover:shadow-sky-500/20 active:scale-95">Book Design Session</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ADUSection;
