
import React, { useState, useMemo } from 'react';
import { getSolarConsultation } from '../services/geminiService';
import { SolarNeeds, CommercialNeeds, AIResponse, UserLocation } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { regionalKnowledge } from '../data/businessKnowledge';

interface SolarSectionProps {
  location: UserLocation;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SolarSection: React.FC<SolarSectionProps> = ({ location }) => {
  const [mode, setMode] = useState<'residential' | 'commercial'>('residential');
  const [resNeeds, setResNeeds] = useState<SolarNeeds>({
    monthlyBill: 250,
    roofType: 'asphalt-shingle',
    energyPriority: 'savings'
  });
  const [comNeeds, setComNeeds] = useState<CommercialNeeds>({
    facilityType: 'industrial',
    squareFootage: 15000,
    primaryGoal: 'cost-reduction'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  const activeRegion = useMemo(() => {
    return location.region in regionalKnowledge ? location.region : 'ON';
  }, [location.region]);

  const policyLink = useMemo(() => {
    return (regionalKnowledge[activeRegion] || regionalKnowledge['Default']).policyUrl;
  }, [activeRegion]);

  const handleResidentialConsult = async () => {
    setLoading(true);
    try {
      const res = await getSolarConsultation(resNeeds, location);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommercialConsult = async () => {
    setLoading(true);
    try {
      const prompt = `Act as an expert Commercial Solar Analyst for Power Solution Canada.
      Location: ${location.city}, ${location.region}.
      Facility: ${comNeeds.facilityType}, ${comNeeds.squareFootage} sqft.
      Goal: ${comNeeds.primaryGoal}.
      
      Generate a professional commercial solar infrastructure brief.
      - 5 high-impact "Core Specifications" (concise, max 12 words each).
      - Include mentions of Net-metering, industrial-grade panels, and business energy grants.
      - Return exactly: summary, recommendations[], estimatedCostRange, and roiEstimate.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedCostRange: { type: Type.STRING },
              roiEstimate: { type: Type.STRING }
            },
            required: ['summary', 'recommendations', 'estimatedCostRange', 'roiEstimate']
          }
        }
      });
      setResult(JSON.parse(response.text));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="flex flex-col space-y-6">
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 leading-tight">
              Power Your Future with <span className="text-emerald-600">Solar Energy.</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
              From residential rooftop arrays to industrial-scale energy ecosystems, we deliver high-yield solar solutions across Ontario.
            </p>
            
            {/* Mode Switcher */}
            <div className="bg-slate-200/50 p-1.5 rounded-2xl w-full sm:w-fit flex shadow-inner border border-slate-200">
              <button 
                onClick={() => { setMode('residential'); setResult(null); }}
                className={`px-8 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${mode === 'residential' ? 'bg-white text-emerald-600 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Residential
              </button>
              <button 
                onClick={() => { setMode('commercial'); setResult(null); }}
                className={`px-8 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${mode === 'commercial' ? 'bg-white text-emerald-600 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Commercial
              </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
             {mode === 'residential' ? (
               <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Avg. Monthly Hydro Bill (CAD)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-900 font-bold text-xl">$</span>
                      <input 
                        type="number"
                        value={resNeeds.monthlyBill}
                        onChange={(e) => setResNeeds({ ...resNeeds, monthlyBill: parseInt(e.target.value) || 0 })}
                        className="w-full p-6 pl-12 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-xl text-slate-900 bg-slate-50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Strategic Energy Priority</label>
                    <div className="space-y-3">
                      {[
                        { id: 'savings', label: 'Financial Savings', sub: 'Focus on maximum utility cost reduction' },
                        { id: 'independence', label: 'Grid Independence', sub: 'High-capacity battery storage integration' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setResNeeds({ ...resNeeds, energyPriority: p.id as any })}
                          className={`w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center justify-between group ${
                            resNeeds.energyPriority === p.id ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <div>
                            <div className={`font-black text-sm uppercase tracking-tight ${resNeeds.energyPriority === p.id ? 'text-emerald-700' : 'text-slate-800'}`}>{p.label}</div>
                            <div className="text-xs text-slate-500">{p.sub}</div>
                          </div>
                          {resNeeds.energyPriority === p.id && <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleResidentialConsult}
                    disabled={loading}
                    className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 active:scale-[0.98]"
                  >
                    {loading ? 'Analyzing Payback...' : 'Calculate Home Savings'}
                  </button>
               </div>
             ) : (
               <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Facility Classification</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['industrial', 'office', 'retail', 'multi-unit'].map(type => (
                        <button
                          key={type}
                          onClick={() => setComNeeds({ ...comNeeds, facilityType: type as any })}
                          className={`p-5 rounded-2xl border-2 font-bold capitalize transition-all text-sm ${
                            comNeeds.facilityType === type ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-200'
                          }`}
                        >
                          {type.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Facility SqFt</label>
                    <input 
                      type="number"
                      value={comNeeds.squareFootage}
                      onChange={(e) => setComNeeds({ ...comNeeds, squareFootage: parseInt(e.target.value) || 0 })}
                      className="w-full p-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-xl text-slate-900 bg-slate-50 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleCommercialConsult}
                    disabled={loading}
                    className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-[0.98]"
                  >
                    {loading ? 'Analyzing Infrastructure...' : 'Generate Enterprise Audit'}
                  </button>
               </div>
             )}
          </div>
        </div>

        <div className="relative">
          {result ? (
            <div className="bg-[#0f172a] text-white p-12 rounded-[3.5rem] shadow-2xl h-full flex flex-col sticky top-24 border border-slate-800">
              <div className="flex-grow space-y-8">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">System Engineering Insight</h4>
                <ul className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-center space-x-6 bg-slate-800/30 p-6 rounded-[1.5rem] border border-slate-800/50 group hover:border-emerald-500/30 transition-all">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex-shrink-0 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-200 text-base font-semibold leading-tight">{rec}</span>
                    </li>
                  ))}
                </ul>

                {/* Grant Notice Specific to Province */}
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 mt-8">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">Grant Eligibility Notice</h5>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        This solar project in <span className="text-emerald-400 font-bold">{location.region === 'ON' ? 'Ontario' : (location.region === 'BC' ? 'British Columbia' : location.region)}</span> may qualify for the <strong>Canada Greener Homes Loan</strong> and provincial tax credits.
                      </p>
                      <a 
                        href={policyLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest border-b border-emerald-400/30 pb-0.5"
                      >
                        Explore Grants for {location.region}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div className="flex-1">
                  <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated ROI ({result.roiEstimate})</div>
                  <div className="text-4xl font-black text-white leading-tight">
                    {result.estimatedCostRange} <span className="text-xl text-emerald-500 font-bold ml-1">CAD</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-4 leading-relaxed max-w-sm font-medium">
                    This estimate represents the gross project cost and <span className="text-emerald-400 font-bold text-[12px]">does not yet factor in potential government grants.</span> Accounts for current Ontario net-metering laws and federal commercial tax incentives.
                  </p>
                </div>
                <button className="whitespace-nowrap px-10 py-6 bg-emerald-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-95">
                  Secure My Rate
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-[3.5rem] overflow-hidden border border-slate-200 bg-white flex items-center justify-center relative group min-h-[600px] sticky top-24 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200" alt="Solar" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="relative z-10 text-center bg-white/40 backdrop-blur-xl p-16 rounded-[3rem] border border-white/50">
                <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Solar Intelligence</h3>
                <p className="text-slate-700 font-semibold max-w-xs mx-auto">Input your details to generate a customized renewable energy roadmap for your property.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SolarSection;
