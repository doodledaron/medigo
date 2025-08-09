'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [micScale, setMicScale] = useState(1);
  const router = useRouter();

  const handleMicClick = () => {
    if (isTransitioning) return;
    
    setIsListening(true);
    setIsTransitioning(true);
    
    // Start enlargement animation
    setMicScale(1.5);
    
    // Navigate after animation completes
    setTimeout(() => {
      router.push('/symptom-checker');
    }, 800);
  };

  // Reset states when component mounts (when returning from symptom checker)
  useEffect(() => {
    setIsListening(false);
    setIsTransitioning(false);
    setMicScale(1);
  }, []);

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--primary-blue-light)'}}>
      {/* Blue Header Section */}
      <div className="text-white px-4 py-8 sm:px-6 sm:py-12 text-center" style={{background: 'linear-gradient(to right, var(--primary-blue), var(--primary-blue-dark))'}}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4">
          How are you, Uncle Tan?
        </h1>
        <p className="text-blue-100 text-base sm:text-lg">
          Tap the mic to tell me your symptoms
        </p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 sm:py-12">
        {/* Start Speaking Section */}
        <div className="flex flex-col items-center mb-12 sm:mb-16 relative">
          <button
            onClick={handleMicClick}
            disabled={isTransitioning}
            style={{
              transform: `scale(${micScale})`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
            className={`
              relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 
              rounded-full shadow-2xl 
              transition-all duration-300 ease-out
              ${!isTransitioning ? 'hover:scale-105 hover:shadow-3xl active:scale-95' : ''}
              focus:outline-none focus:ring-4
              ${isListening ? 'animate-pulse' : ''}
              ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              background: `linear-gradient(to bottom right, var(--primary-blue), var(--primary-blue-dark))`,
              boxShadow: isListening ? `0 25px 50px -12px var(--primary-blue-light)` : undefined,
              '--tw-ring-color': 'var(--primary-blue-light)'
            } as React.CSSProperties}
          >
            {/* Subtle glow animation */}
            <div className={`
              absolute inset-0 rounded-full 
              ${isListening ? 'animate-ping opacity-20' : ''}
            `} style={{backgroundColor: isListening ? 'var(--primary-blue-light)' : undefined}}></div>
            
            {/* Microphone Icon */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <svg 
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </button>
          
          <p className={`mt-4 sm:mt-6 text-xl sm:text-2xl font-medium text-gray-700 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {isTransitioning ? 'Opening...' : 'Start Speaking'}
          </p>
        </div>

        {/* Recent Activity Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Activity</h2>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Last Visit Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'var(--primary-blue-light)'}}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{color: 'var(--primary-blue)'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Last Visit</h3>
                  <p className="text-gray-700 mt-1 text-sm sm:text-base">Singapore General Hospital - Cardiology</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">2 days ago</p>
                </div>
              </div>
            </div>

            {/* Appointment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'var(--secondary-cream)'}}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{color: 'var(--neutral-600)'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Appointment</h3>
                  <p className="text-gray-700 mt-1 text-sm sm:text-base">Dr. Michael Tan - Follow up</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Next Tuesday 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Assessment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'var(--tertiary-pink-light)'}}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{color: 'var(--tertiary-pink-dark)'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Assessment</h3>
                  <p className="text-gray-700 mt-1 text-sm sm:text-base">Chest pain evaluation completed</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
