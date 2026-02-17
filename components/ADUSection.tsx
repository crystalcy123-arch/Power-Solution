
import React, { useState, useMemo, useEffect } from 'react';
import { getADUConsultation } from '../services/geminiService';
import { ADUConfig, AIResponse, UserLocation } from '../types';
import { regionalKnowledge } from '../data/businessKnowledge';

interface ADUSectionProps {
  location: UserLocation;
}

const SuccessModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-center text-slate-900 mb-4 font-heading">Success!</h3>
        <p className="text-slate-600 text-center leading-relaxed mb-8">
          Your design session request has been submitted. Our architectural team will contact you shortly to discuss your project.
        </p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
};

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
  
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const toggleAddon = (key: keyof ADUConfig['addons']) => {
    setConfig(prev => ({
      ...prev,
      addons: {
        ...prev.addons,
        [key]: !prev.addons[key]
      }
    }));
  };

  const handleBookSession = async () => {
    if (!contact.email || !contact.name) {
      alert("Please provide at least your name and email.");
      return;
    }

    setIsSubmitting(true);
    const activeAddonsList = Object.entries(config.addons)
      .filter(([_, active]) => active)
      .map(([name]) => name.replace(/([A-Z])/g, ' $1').trim())
      .join(", ") || "None";

    const formData = {
      projectType: 'ADU Design Session',
      customerName: contact.name,
      customerEmail: contact.email,
      customerPhone: contact.phone,
      aduSize: config.size,
      basePrice: basePrice,
      rentalEstimate: rentalIncome,
      addons: activeAddonsList,
      city: location.city,
      province: activeRegion
    };

    try {
      const response = await fetch("https://formspree.io/f/xpqjrjyz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setContact({ name: '', email: '', phone: '' });
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again or contact crystalsli@outlook.com directly.");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <section className="max-w-7xl mx-auto px-4">
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
      
      {isEnlarged && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out" onClick={() => setIsEnlarged(false)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]" onClick={() => setIsEnlarged(false)}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={currentImage} alt="Enlarged View" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none" draggable={false} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-6">Unlock the Full Potential of Your Backyard</h2>
            <p className="text-slate-600 text-lg leading-relaxed">We configure your affordable and high-performance ADU with solar energy solution and smart-tech options.</p>
            
            <div className="mt-8 bg-sky-50 border-l-4 border-sky-500 p-5 rounded-r-2xl shadow-sm">
              <p className="text-sky-900 text-sm font-medium leading-relaxed">
                🏠 You may be eligible for the <span className="font-bold">Canada Greener Homes Loan</span> (up to $40,000 interest-free) or provincial secondary suite grants. 
                Visit the <a href={policyLink} target="_blank" rel="noopener noreferrer" className="underline font-bold text-sky-600 hover:text-sky-800 transition-colors ml-1">Official Government Portal</a>.
              </p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="relative z-10">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Design Framework</label>
              <div className="grid grid-cols-3 gap-4">
                {['studio', '1-bedroom', '2-bedroom'].map((s) => (
                  <button key={s} onClick={() => setConfig({ ...config, size: s as any })} className={`py-8 px-2 text-center rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${config.size === s ? 'bg-sky-500 border-sky-500 text-white font-bold shadow-lg shadow-sky-200' : 'border-slate-100 hover:border-slate-300 text-slate-600 bg-slate-50'}`}>
                    <span className="text-lg block capitalize">{s.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0f172a] p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between shadow-2xl">
              <div className="flex items-center space-x-6 w-full md:w-auto mb-6 md:mb-0">
                <div className="w-[84px] h-[112px] bg-[#0ea5e9] rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(14,165,233,0.25)]">
                   <div className="w-12 h-12 rounded-full border-[3px] border-white/90 flex items-center justify-center"><span className="text-2xl font-black">$</span></div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white leading-tight block">Monthly Rental<br />Income</div>
              </div>
              <div className="text-right text-4xl md:text-5xl font-black text-white">{rentalIncome} <span className="text-2xl">CAD</span></div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Optional Smart-Tech Add-ons</label>
              <div className="space-y-3">
                {addonOptions.map((opt) => (
                  <button key={opt.key} onClick={() => toggleAddon(opt.key)} className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center space-x-4 text-left group ${config.addons[opt.key] ? 'bg-sky-50 border-sky-500' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${config.addons[opt.key] ? 'bg-sky-500 text-white' : 'bg-white text-slate-400'}`}>{opt.icon}</div>
                    <div className="flex-grow">
                      <div className="text-sm font-black text-slate-900 leading-none mb-1">{opt.label}</div>
                      <div className="text-xs text-slate-500">{opt.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Your Contact Information</label>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-medium" />
                <input type="email" placeholder="Email Address" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-medium" />
              </div>
              <input type="tel" placeholder="Phone Number" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-medium" />
            </div>

            <button 
              disabled={isSubmitting}
              onClick={handleBookSession}
              className={`w-full py-6 rounded-[1.5rem] font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sky-200'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Book Design Session</span>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="bg-[#0f172a] text-white p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col sticky top-24 border border-slate-800">
             <div className="flex-grow space-y-6">
                <div className="rounded-[2.5rem] overflow-hidden border border-slate-200/20 bg-white p-2 shadow-2xl relative cursor-zoom-in" onClick={() => setIsEnlarged(true)}>
                  <img src={currentImage} alt="Framework View" className="w-full h-auto max-h-[450px] object-contain rounded-[2rem] bg-white" />
                </div>
                <div className="mt-8">
                  <div className="text-4xl font-black text-white">{basePrice} <span className="text-xl text-sky-500 ml-1">CAD</span></div>
                  <p className="text-slate-500 text-sm mt-4 font-medium italic">Includes full SIP structural shell and standard installation. Government grants not included in estimate.</p>
                </div>
                <div className="space-y-4">
                  {highlights.map((h, i) => (
                    <div key={i} className="bg-slate-800/20 rounded-2xl border border-slate-800/50 p-5">
                      <h4 className="text-sm font-black text-sky-400 mb-2">{h.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{h.intro}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ADUSection;
