import { UserLocation } from '../types';

export const detectLocation = async (): Promise<UserLocation> => {
  try {
    // 使用 ipwho.is 获取地理位置，而不是 Formspree
    const response = await fetch('https://ipwho.is/'); 
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return {
      city: data.city || 'St. Catharines',
      region: data.region_code || 'ON',
      country: data.country || 'Canada',
      isDetected: true
    };
  } catch (err) {
    console.warn('Location detection failed. Defaulting to St. Catharines, ON.', err);
    return {
      city: 'St. Catharines',
      region: 'ON',
      country: 'Canada',
      isDetected: false
    };
  }
};
