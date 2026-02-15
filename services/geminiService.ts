
import { GoogleGenAI, Type } from "@google/genai";
import { ADUConfig, SolarNeeds, UserLocation } from "../types";
import { regionalKnowledge, globalConstants } from "../data/businessKnowledge";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getADUConsultation = async (config: ADUConfig, location: UserLocation) => {
  const regionKey = location.region in regionalKnowledge ? location.region : 'Default';
  const regionData = regionalKnowledge[regionKey];
  
  const activeAddons = Object.entries(config.addons)
    .filter(([_, active]) => active)
    .map(([name]) => {
      if (name === 'zonalComfort') return 'Luxury Radiant Heating (Secondary Zonal Comfort)';
      if (name === 'energyIndependence') return 'Net-Zero Energy Bundle (Solar & Storage)';
      if (name === 'smartSecurity') return 'Whole-Home Intelligence (Smart Home Suite)';
      return name;
    })
    .join(", ");

  const prompt = `
    SYSTEM INSTRUCTION: 
    You are the Senior Sales Architect for ${globalConstants.companyName}. 
    The client is in ${location.city}, ${location.region}.
    
    GOAL: Provide a high-conversion, professional summary of building specs. 
    Make it punchy, clear, and easy to understand at a glance.

    USER CONFIGURATION:
    - Size: ${config.size}
    - Add-ons: ${activeAddons || 'Standard Build'}

    TASK:
    Generate exactly 5 high-impact "Core Specifications" that increase purchase intent.
    - Each bullet must be concise (max 15 words).
    - Focus on: Zoning compliance, Net-metering/Solar, Ontario Building Code (OBC), Incentives, and Durability (winter-ready).
    - If "Luxury Radiant Heating" is selected, emphasize the integrated radiant floor heating for bathrooms and living areas.
    - Use DOUBLE-PANE windows (no triple-pane).
    - Ensure tone is authoritative but simple.
    - Summary field should be empty as it is no longer displayed.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      seed: 42, // Ensures consistent output for the same configuration
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'Keep this empty' },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: 'Exactly 5 punchy core specifications'
          },
          estimatedCostRange: { type: Type.STRING },
        },
        required: ['summary', 'recommendations', 'estimatedCostRange']
      }
    }
  });

  return JSON.parse(response.text);
};

export const getSolarConsultation = async (needs: SolarNeeds, location: UserLocation) => {
  const regionKey = location.region in regionalKnowledge ? location.region : 'Default';
  const regionData = regionalKnowledge[regionKey];

  const prompt = `Act as an expert Canadian renewable energy consultant for ${globalConstants.companyName}.
  Client Location: ${location.city}, ${location.region}.
  Local Context: ${regionData.incentives} (OBC Standards).
  Analysis: ${JSON.stringify(needs)}.
  Hardware: ${globalConstants.smartTech.energy}.
  
  Provide:
  1. System size optimized for Canadian latitude.
  2. Financial payback taking into account grants.
  3. ROI Estimate in CAD.`;

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
          roiEstimate: { type: Type.STRING },
        },
        required: ['summary', 'recommendations', 'estimatedCostRange', 'roiEstimate']
      }
    }
  });

  return JSON.parse(response.text);
};
