'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HospitalSearchService } from '../../services/hospitalSearchService';
import { pageContainer, contentSection, buttonTransition } from '../../utils/transitions';

export default function AssessmentResults() {
  const [isVisible, setIsVisible] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleRecordAgain = () => {
    router.push('/symptom-checker');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save changes
      setAssessmentData(editedData);
      localStorage.setItem('assessmentData', JSON.stringify(editedData));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = async () => {
    if (!assessmentData) return;
    
    console.log('🔵 Assessment Results - handleConfirm clicked');
    console.log('📋 Assessment data:', assessmentData);
    
    setIsLoading(true);
    try {
      const location = await HospitalSearchService.getCurrentLocation();
      console.log('📍 Location obtained:', location);
      
      const searchRequest = {
        sessionId: HospitalSearchService.generateSessionId(),
        symptoms: `${assessmentData.symptom || 'chest pain'}, ${assessmentData.description || 'chest tightness'}`,
        onset: assessmentData.started || '2 days',
        location,
        preference: 'public',
        insuranceRef: true,
        department: assessmentData.recommend_department || 'respiratory'
      };

      console.log('📤 Sending hospital search request:', searchRequest);
      const hospitalResponse = await HospitalSearchService.searchHospitals(searchRequest);
      console.log('📥 Received hospital search response:', hospitalResponse);
      
      localStorage.setItem('hospitalSearchResponse', JSON.stringify(hospitalResponse));
      console.log('💾 Stored response in localStorage');
      
      router.push('/nearby-hospitals');
    } catch (error) {
      console.error('❌ Failed to search hospitals:', error);
      router.push('/nearby-hospitals');
    } finally {
      setIsLoading(false);
    }
  };

  // Load assessment data and initialize page transition
  useEffect(() => {
    // Initialize page visibility
    setTimeout(() => setIsVisible(true), 50);
    // Load data from localStorage
    const storedData = localStorage.getItem('assessmentData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setAssessmentData(parsed);
        setEditedData(parsed);
      } catch (error) {
        console.error('Failed to parse assessment data:', error);
        // Fallback to static data
        const fallbackData = {
          symptom: 'Chest pain',
          started: 'This morning around 8 AM',
          description: 'Sharp pain in the center of chest, gets worse when I breathe deeply or move around. Pain level is about 7 out of 10.',
          recommend_department: 'cardiology'
        };
        setAssessmentData(fallbackData);
        setEditedData(fallbackData);
      }
    } else {
      // No data in localStorage, use static fallback
      const fallbackData = {
        symptom: 'Chest pain',
        started: 'This morning around 8 AM',
        description: 'Sharp pain in the center of chest, gets worse when I breathe deeply or move around. Pain level is about 7 out of 10.',
        recommend_department: 'cardiology'
      };
      setAssessmentData(fallbackData);
      setEditedData(fallbackData);
    }
  }, []);

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
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Assessment Results</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 sm:py-6 max-w-2xl mx-auto">
        
        {/* Recommended Specialist Section */}
        <div className={contentSection(isVisible, 0).className} style={contentSection(isVisible, 0).style}>
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border hover:shadow-md transition-shadow duration-300" style={{background: `linear-gradient(to right, var(--primary-blue-light), var(--secondary-cream))`, borderColor: 'var(--primary-blue-light)'}}>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Recommended Specialist</h2>
            
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300" style={{backgroundColor: 'var(--tertiary-pink-light)'}}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--tertiary-pink-dark)'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 transition-colors duration-300" style={{'--hover-color': 'var(--tertiary-pink-dark)'} as React.CSSProperties}>
                    {assessmentData?.recommend_department ? assessmentData.recommend_department.charAt(0).toUpperCase() + assessmentData.recommend_department.slice(1) : 'Cardiology'}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-lg">
                    {assessmentData?.recommend_department === 'cardio' ? 'Heart and cardiovascular specialist' : 
                     assessmentData?.recommend_department ? `${assessmentData.recommend_department.charAt(0).toUpperCase() + assessmentData.recommend_department.slice(1)} specialist` : 
                     'Heart and cardiovascular specialist'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Information */}
        <div className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8 hover:shadow-md transition-all duration-300 ${contentSection(isVisible, 200).className}`} style={contentSection(isVisible, 200).style}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Please confirm your information:</h2>
            <button
              onClick={handleEditToggle}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                isEditing 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
              }`}
              style={{
                boxShadow: isEditing 
                  ? '0 0 20px rgba(34, 197, 94, 0.4), 0 4px 15px rgba(34, 197, 94, 0.2)' 
                  : '0 0 20px rgba(59, 130, 246, 0.4), 0 4px 15px rgba(59, 130, 246, 0.2)'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isEditing ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                )}
              </svg>
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Symptom */}
            <div className="group">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors duration-200">Symptom:</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData?.symptom || ''}
                  onChange={(e) => handleInputChange('symptom', e.target.value)}
                  className="w-full text-base sm:text-lg text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter symptom"
                />
              ) : (
                <p className="text-base sm:text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                  {assessmentData?.symptom || 'Chest pain'}
                </p>
              )}
            </div>

            {/* Started */}
            <div className="group">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors duration-200">Started:</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData?.started || ''}
                  onChange={(e) => handleInputChange('started', e.target.value)}
                  className="w-full text-base sm:text-lg text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="When did it start?"
                />
              ) : (
                <p className="text-base sm:text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                  {assessmentData?.started || 'This morning around 8 AM'}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="group">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors duration-200">Description:</h3>
              {isEditing ? (
                <textarea
                  value={editedData?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full text-sm sm:text-lg text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px]"
                  placeholder="Describe your symptoms in detail"
                />
              ) : (
                <p className="text-sm sm:text-lg text-gray-900 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                  {assessmentData?.description || 'Sharp pain in the center of chest, gets worse when I breathe deeply or move around. Pain level is about 7 out of 10.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-3 sm:space-y-4 ${contentSection(isVisible, 400).className}`} style={contentSection(isVisible, 400).style}>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={{backgroundColor: 'var(--primary-blue)', '--hover-bg': 'var(--primary-blue-dark)'} as React.CSSProperties}
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-base sm:text-lg">Finding hospitals...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-base sm:text-lg">Yes, this is correct</span>
              </>
            )}
          </button>

          <button
            onClick={handleRecordAgain}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span className="text-base sm:text-lg group-hover:text-gray-900 transition-colors duration-200">Record again</span>
          </button>
        </div>

        {/* Subtle decorative element */}
        <div className={`mt-8 sm:mt-12 flex justify-center ${contentSection(isVisible, 600).className}`} style={contentSection(isVisible, 600).style}>
          <div className="w-8 sm:w-12 h-1 rounded-full opacity-30 hover:opacity-60 transition-opacity duration-300" style={{background: `linear-gradient(to right, var(--primary-blue), var(--tertiary-pink))`}}></div>
        </div>
      </div>
    </div>
  );
}