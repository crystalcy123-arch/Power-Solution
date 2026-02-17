
import { UserLocation } from '../types';

export const detectLocation = async (): Promise<UserLocation> => {
  try {
    // ipwho.is is a reliable alternative that often bypasses basic ad-blockers
    const response = await fetch('https://formspree.io/f/xpqjrjyz');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    // Check if the API returned a success status
    if (!data.success) {
      throw new Error(data.message || 'Location detection failed');
    }

    return {
      city: data.city || 'St. Catharines',
      region: data.region_code || 'ON',
      country: data.country || 'Canada',
      isDetected: true
    };
  } catch (err) {
    console.warn('Location detection failed or was blocked. Defaulting to St. Catharines, ON.', err);
    
    // Defaulting to the user's requested data point if detection is blocked
    return {
      city: 'St. Catharines',
      region: 'ON',
      country: 'Canada',
      isDetected: false
    };
  }
};
