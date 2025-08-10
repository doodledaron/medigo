'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital } from '../../types/medical';
import { HospitalService } from '../../services/hospitalService';
import { DataTransformers } from '../../utils/dataTransformers';
import { HospitalSearchResponse } from '../../types/api';
import { pageContainer, contentSection, cardTransition, buttonTransition } from '../../utils/transitions';
import { hospitals as staticHospitals } from '../../data/hospitals';


export default function NearbyHospitals() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [queueInfo, setQueueInfo] = useState<{[key: number]: { waitTime: string; peopleAhead: number; travelTime: string }}>({});

  // Image mapping for different hospital types and names
  const getHospitalImage = (hospitalName: string, hospitalType: 'public' | 'private', hospitalId?: string): string => {
    // Try to match by name first with more sophisticated matching
    const normalizedApiName = hospitalName.toLowerCase().replace(/\s+/g, ' ').trim();
    
    const staticHospital = staticHospitals.find(h => {
      const normalizedStaticName = h.name.toLowerCase().replace(/\s+/g, ' ').trim();
      
      // Exact match
      if (normalizedApiName === normalizedStaticName) return true;
      
      // Check if key words match
      const apiWords = normalizedApiName.split(' ');
      const staticWords = normalizedStaticName.split(' ');
      
      // Find common significant words (ignore common words like 'hospital', 'general', etc.)
      const skipWords = ['hospital', 'general', 'medical', 'center', 'centre'];
      const apiSignificantWords = apiWords.filter(word => !skipWords.includes(word) && word.length > 2);
      const staticSignificantWords = staticWords.filter(word => !skipWords.includes(word) && word.length > 2);
      
      // If we have significant word matches
      return apiSignificantWords.some(apiWord => 
        staticSignificantWords.some(staticWord => 
          staticWord.includes(apiWord) || apiWord.includes(staticWord)
        )
      );
    });
    
    if (staticHospital?.image) {
      console.log(`🖼️ Matched API hospital "${hospitalName}" with static hospital "${staticHospital.name}" image`);
      return staticHospital.image;
    }
    
    // Use static hospital images as defaults, cycling through them
    const staticImages = staticHospitals
      .filter(h => h.type === hospitalType && h.image)
      .map(h => h.image!);
    
    if (staticImages.length > 0) {
      // Use hospital ID or name to consistently assign the same image to the same hospital
      const seed = hospitalId ? parseInt(hospitalId.replace(/\D/g, '')) : hospitalName.charCodeAt(0);
      const imageIndex = seed % staticImages.length;
      console.log(`🎯 Assigned ${hospitalType} hospital "${hospitalName}" static image #${imageIndex}`);
      return staticImages[imageIndex];
    }
    
    // Fallback images if no static images available
    const fallbackImages = {
      public: 'https://vaidam-images.s3.ap-southeast-1.amazonaws.com/files/main_building_changi_general_hospital_singapore.jpg',
      private: 'https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/12/2020/09/istockphoto-1204775285-612x612-1.jpg'
    };
    
    return fallbackImages[hospitalType];
  };
  
  // Transform API hospital data to match existing Hospital interface
  const transformApiHospitalToHospital = (apiHospital: HospitalSearchResponse['top8'][0]): Hospital => {
    // Normalize hospital type from API to match our interface
    const normalizeHospitalType = (type: string): 'public' | 'private' => {
      const lowerType = type.toLowerCase().trim();
      if (lowerType.includes('public') || lowerType.includes('government')) return 'public';
      if (lowerType.includes('private')) return 'private';
      // Default to public if unclear
      return 'public';
    };

    const hospitalType = normalizeHospitalType(apiHospital.hospital_type);

    return {
      id: parseInt(apiHospital.id.replace('HSP', '')) || Math.random() * 1000,
      name: apiHospital.name,
      address: apiHospital.address,
      type: hospitalType,
      specialties: ['General Medicine', 'Emergency'], // Default specialties since not provided in API
      rating: 4.5, // Default rating since not provided in API
      distance: apiHospital.traffic.distance_text,
      phone: apiHospital.phone,
      emergencyServices: true,
      image: getHospitalImage(apiHospital.name, hospitalType, apiHospital.id)
    };
  };

  useEffect(() => {
    console.log('🟢 Nearby Hospitals - Page loaded');
    setMounted(true);
    
    // Initialize page transition
    setTimeout(() => setIsVisible(true), 50);
    
    // Try to load hospital search response from localStorage first
    const storedResponse = localStorage.getItem('hospitalSearchResponse');
    console.log('💾 Stored response from localStorage:', storedResponse);
    
    let hospitalsData: Hospital[] = [];
    let queueData: {[key: number]: { waitTime: string; peopleAhead: number; travelTime: string }} = {};
    
    if (storedResponse) {
      try {
        const apiResponse: HospitalSearchResponse = JSON.parse(storedResponse);
        console.log('📋 Parsed API response:', apiResponse);
        console.log('🏥 Number of hospitals from API:', apiResponse.top8?.length || 0);
        
        // Transform API response to Hospital interface
        hospitalsData = apiResponse.top8.map(transformApiHospitalToHospital);
        console.log('🔄 Transformed hospitals data:', hospitalsData);
        
        // Transform API queue data
        apiResponse.top8.forEach(apiHospital => {
          const hospitalId = parseInt(apiHospital.id.replace('HSP', '')) || Math.random() * 1000;
          queueData[hospitalId] = {
            waitTime: `${apiHospital.avg_wait_minutes} min`,
            peopleAhead: apiHospital.current_queue_people,
            travelTime: `${apiHospital.travel_min_in_traffic} min`
          };
        });
        console.log('⏱️ Queue data from API:', queueData);
      } catch (error) {
        console.error('❌ Failed to parse hospital search response:', error);
      }
    } else {
      console.log('⚠️ No stored response found in localStorage');
    }
    
    // Fallback to static data if no API response available
    if (hospitalsData.length === 0) {
      console.log('🔄 Falling back to static data');
      hospitalsData = HospitalService.getAllHospitals().map(DataTransformers.transformHospitalForDisplay);
      hospitalsData.forEach(hospital => {
        queueData[hospital.id] = HospitalService.getHospitalQueueInfo(hospital.id);
      });
      console.log('📊 Using static hospitals data:', hospitalsData.length, 'hospitals');
    }
    
    console.log('🏥 Final hospitals data to display:', hospitalsData);
    setHospitals(hospitalsData);
    setQueueInfo(queueData);
  }, []);

  const filteredHospitals = hospitals.filter(hospital => 
    filter === 'all' || hospital.type === filter
  );

  const handleBack = () => {
    router.back();
  };

  const toggleExpand = (hospitalId: string) => {
    setExpandedCard(expandedCard === hospitalId ? null : hospitalId);
  };

  const handleSelectHospital = (hospital: Hospital) => {
    const params = new URLSearchParams({
      hospitalId: hospital.id.toString(),
      hospitalName: hospital.name,
      hospitalAddress: hospital.address
    });
    router.push(`/doctor-selection?${params.toString()}`);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  if (!mounted) return null;

  return (
    <div className={`${pageContainer(isVisible)}`} style={{backgroundColor: 'var(--primary-blue-light)'}}>
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 sm:py-4">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-3 sm:mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Nearby Hospitals</h1>
        </div>
      </div>

      {/* Minimal Filter */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'public', label: 'Public' },
              { key: 'private', label: 'Private' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  filter === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital.id}
            className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${cardTransition()}`}
          >
            {/* Hospital Image */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300">
              {hospital.image ? (
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400 font-medium">Hospital Image</span>
                  </div>
                </div>
              )}
              
              {/* Hospital Type Badge */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                  hospital.type === 'private' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                    {hospital.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">{hospital.address}</p>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 sm:space-x-4">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {queueInfo[hospital.id]?.travelTime || '12 min'}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {hospital.distance}
                    </span>
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleExpand(hospital.id.toString())}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <svg 
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ${
                      expandedCard === hospital.id.toString() ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{queueInfo[hospital.id]?.waitTime || '25 min'}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Wait time</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{queueInfo[hospital.id]?.peopleAhead || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-500">People ahead</div>
                </div>
              </div>

              {/* Expanded Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-out ${
                expandedCard === hospital.id.toString() 
                  ? 'max-h-96 opacity-100 mb-6' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Rating</span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900 mr-2">{DataTransformers.formatRating(hospital.rating)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(hospital.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-2">Specialties</span>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Call Hospital
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Get Directions
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={() => handleSelectHospital(hospital)}
                  className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl ${buttonTransition()} hover:shadow-md text-sm sm:text-base`}
                >
                  Select Hospital
                </button>
                
                <button
                  onClick={() => handleCall(hospital.phone)}
                  className={`p-2.5 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl ${buttonTransition()}`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}