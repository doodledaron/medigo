import { HospitalSearchRequest, HospitalSearchResponse } from '../types/api';

export class HospitalSearchService {
  private static readonly HOSPITAL_SEARCH_URL = 'https://doodledaron.app.n8n.cloud/webhook/d634aaae-c6bb-4d31-aa3a-ad0397854f10';

  static async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    // Hard-coded location for Singapore
    return {
      lat: 3.139,
      lng: 101.686
    };
  }

  static async searchHospitals(request: HospitalSearchRequest): Promise<HospitalSearchResponse> {
    console.log('🌐 Making API call to:', this.HOSPITAL_SEARCH_URL);
    console.log('📋 Request payload:', JSON.stringify(request, null, 2));
    
    try {
      const response = await fetch(this.HOSPITAL_SEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('❌ Hospital search API error:', error);
      throw error;
    }
  }

  static generateSessionId(): string {
    return 'session_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
  }
}