'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pageContainer, buttonTransition } from '../utils/transitions';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [micScale, setMicScale] = useState(1);
  const [showMagicParticles, setShowMagicParticles] = useState(false);
  const [orbColorPhase, setOrbColorPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleMicClick = async () => {
    if (isTransitioning) return;
    
    setIsListening(true);
    setIsTransitioning(true);
    setShowMagicParticles(true);
    
    // Send POST request to webhook -> post location, preference, insuranceRef
    try {
      await fetch('https://doodledaron.app.n8n.cloud/webhook/84d12472-a1d7-45e7-bff6-3cd6021be8ef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: { lat: 3.139, lng: 101.686 },
          preference: "public",
          insuranceRef: true
        })
      });
    } catch (error) {
      console.error('Failed to send webhook request:', error);
    }
    
    // Multi-stage magical transition
    // Stage 1: Initial scale and magic particles (0-300ms)
    setMicScale(1.3);
    
    // Stage 2: Color morphing begins (300ms)
    setTimeout(() => {
      setOrbColorPhase(1);
      setMicScale(1.6);
    }, 300);
    
    // Stage 3: Final scaling and shimmer (600ms)
    setTimeout(() => {
      setOrbColorPhase(2);
      setMicScale(2.2);
    }, 600);
    
    // Stage 4: Navigate with fade effect (1000ms)
    setTimeout(() => {
      const pageContent = document.querySelector('.page-content');
      if (pageContent) {
        pageContent.classList.add('page-fade-out');
      }
      
      setTimeout(() => {
        router.push('/symptom-checker');
      }, 200);
    }, 1000);
  };

  // Reset states when component mounts (when returning from symptom checker)
  useEffect(() => {
    setIsListening(false);
    setIsTransitioning(false);
    setMicScale(1);
    
    // Initialize page transition
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return (
    <div className={`${pageContainer(isVisible)} page-content`} style={{backgroundColor: 'var(--primary-blue-light)'}}>
      {/* Header Section */}
      <div className="px-4 py-8 sm:px-6 sm:py-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4 text-gray-900 animate-fade-in-up">
        Uncle Tan, today you good?
        </h1>
        <p className="text-gray-600 text-base sm:text-lg animate-fade-in-up animation-delay-300">
        Tap mic, tell me what happen
        </p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 sm:py-12">
        {/* Start Speaking Section */}
        <div className="flex flex-col items-center mb-12 sm:mb-16 relative">
          <button
            onClick={handleMicClick}
            disabled={isTransitioning}
            className={`
              relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 
              rounded-full shadow-2xl 
              ${buttonTransition()}
              ${!isTransitioning ? 'hover:shadow-3xl' : ''}
              focus:outline-none focus:ring-4
              ${isListening ? 'animate-pulse' : ''}
              ${isTransitioning ? 'cursor-not-allowed magical-transition' : 'cursor-pointer'}
            `}
            style={{
              transform: `scale(${micScale}) ${isTransitioning ? 'rotate(360deg)' : ''}`,
              transition: isTransitioning 
                ? 'all 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)' 
                : 'transform 0.3s ease-out',
              background: orbColorPhase === 0 
                ? `linear-gradient(to bottom right, var(--primary-blue), var(--primary-blue-dark))`
                : orbColorPhase === 1
                ? `linear-gradient(45deg, var(--primary-blue), var(--tertiary-pink), var(--primary-blue-dark))`
                : `linear-gradient(135deg, var(--tertiary-pink), var(--tertiary-pink-dark), var(--primary-blue))`,
              boxShadow: isTransitioning 
                ? `0 35px 80px -12px rgba(236, 72, 153, 0.8), 0 0 40px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)`
                : isListening 
                ? `0 25px 50px -12px var(--primary-blue-light)` 
                : undefined,
              '--tw-ring-color': 'var(--primary-blue-light)',
              filter: isTransitioning ? 'blur(0.5px) brightness(1.2)' : undefined
            } as React.CSSProperties}
          >
            {/* Magical glow animations */}
            <div className={`
              absolute inset-0 rounded-full 
              ${isListening && !isTransitioning ? 'animate-ping opacity-20' : ''}
              ${isTransitioning ? 'magical-glow' : ''}
            `} style={{backgroundColor: isListening ? 'var(--primary-blue-light)' : undefined}}></div>
            
            {/* Magic particles */}
            {showMagicParticles && (
              <>
                <div className="absolute -inset-8 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full animate-magical-particle"
                      style={{
                        left: `${50 + 30 * Math.cos(i * 30 * Math.PI / 180)}%`,
                        top: `${50 + 30 * Math.sin(i * 30 * Math.PI / 180)}%`,
                        animationDelay: `${i * 100}ms`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
                <div className="absolute -inset-12 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i + 12}
                      className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
                      style={{
                        left: `${50 + 40 * Math.cos(i * 45 * Math.PI / 180)}%`,
                        top: `${50 + 40 * Math.sin(i * 45 * Math.PI / 180)}%`,
                        animationDelay: `${300 + i * 150}ms`,
                        animationDuration: '1.2s'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            
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
          
          <p className={`mt-4 sm:mt-6 text-xl sm:text-2xl font-medium text-gray-700 transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
            {isTransitioning ? 'Connecting to AI...' : 'Start Speaking'}
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
