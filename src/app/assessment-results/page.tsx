'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AssessmentResults() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleRecordAgain = () => {
    router.push('/symptom-checker');
  };

  const handleConfirm = () => {
    router.push('/nearby-hospitals');
  };

  // Stagger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--primary-blue-light)'}}>
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
        <div className={`mb-6 sm:mb-8 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
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
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 transition-colors duration-300" style={{'--hover-color': 'var(--tertiary-pink-dark)'} as React.CSSProperties}>Cardiology</h3>
                  <p className="text-gray-600 text-sm sm:text-lg">Heart and cardiovascular specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Information */}
        <div className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8 hover:shadow-md transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '200ms' }}>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Please confirm your information:</h2>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Symptom */}
            <div className="group">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors duration-200">Symptom:</h3>
              <p className="text-base sm:text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-200">Chest pain</p>
            </div>

            {/* Started */}
            <div className="group">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors duration-200">Started:</h3>
              <p className="text-base sm:text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-200">This morning around 8 AM</p>
            </div>

            {/* Description */}
            <div className="group">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors duration-200">Description:</h3>
              <p className="text-sm sm:text-lg text-gray-900 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                Sharp pain in the center of chest, gets worse when I breathe deeply 
                or move around. Pain level is about 7 out of 10.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-3 sm:space-y-4 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '400ms' }}>
          <button
            onClick={handleConfirm}
            className="w-full text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 group" style={{backgroundColor: 'var(--primary-blue)', '--hover-bg': 'var(--primary-blue-dark)'} as React.CSSProperties}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-base sm:text-lg">Yes, this is correct</span>
          </button>

          <button
            onClick={handleRecordAgain}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span className="text-base sm:text-lg group-hover:text-gray-900 transition-colors duration-200">Record again</span>
          </button>
        </div>

        {/* Subtle decorative element */}
        <div className={`mt-8 sm:mt-12 flex justify-center transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '600ms' }}>
          <div className="w-8 sm:w-12 h-1 rounded-full opacity-30 hover:opacity-60 transition-opacity duration-300" style={{background: `linear-gradient(to right, var(--primary-blue), var(--tertiary-pink))`}}></div>
        </div>
      </div>
    </div>
  );
}