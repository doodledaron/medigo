'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SymptomChecker() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkipToDemo = () => {
    router.push('/assessment-results');
  };

  const symptomOptions = [
    { 
      name: 'Chest Pain', 
      icon: (
        <svg className="w-8 h-8" style={{color: 'var(--tertiary-pink-dark)'}} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Headache', 
      icon: (
        <svg className="w-8 h-8" style={{color: 'var(--tertiary-pink-dark)'}} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Fever', 
      icon: (
        <svg className="w-8 h-8" style={{color: 'var(--tertiary-pink-dark)'}} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v6.586l2.707 2.707a1 1 0 01-1.414 1.414L10 11.414V3a1 1 0 011-1z" clipRule="evenodd" />
          <path d="M6 10a4 4 0 108 0 4 4 0 00-8 0z" />
        </svg>
      )
    },
    { 
      name: 'Stomach Pain', 
      icon: (
        <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        </svg>
      )
    }
  ];

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
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Symptom Checker</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Large Mic Button */}
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <button
            onClick={handleMicClick}
            className={`
              relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80
              rounded-full shadow-2xl 
              transition-all duration-500 ease-out
              hover:scale-105 hover:shadow-3xl
              active:scale-95
              focus:outline-none focus:ring-4
              ${isListening ? 'animate-pulse' : ''}
            `}
            style={{
              background: `linear-gradient(to bottom right, var(--tertiary-pink), var(--tertiary-pink-dark))`,
              boxShadow: isListening ? `0 35px 60px -12px var(--tertiary-pink-light)` : undefined,
              '--tw-ring-color': 'var(--tertiary-pink-light)'
            } as React.CSSProperties}
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-2 sm:-inset-4 rounded-full opacity-30 blur-xl" style={{background: `linear-gradient(to right, var(--tertiary-pink-light), var(--tertiary-pink))`}}></div>
            
            {/* Listening animation ring */}
            <div className={`
              absolute inset-0 rounded-full 
              ${isListening ? 'animate-ping opacity-30' : ''}
            `} style={{backgroundColor: isListening ? 'var(--tertiary-pink)' : undefined}}></div>
            
            {/* Microphone Icon */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <svg 
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-white drop-shadow-lg" 
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
        </div>

        {/* Instructions */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Tell us what's troubling you
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Tap the microphone and describe your symptoms clearly. For example: 
            <span className="block mt-2 text-gray-800 font-medium text-sm sm:text-base">
              "I have chest pain since yesterday"
            </span>
          </p>
        </div>

        {/* Skip to Demo Button */}
        <div className="text-center mb-8 sm:mb-12">
          <button
            onClick={handleSkipToDemo}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-base sm:text-lg transition-colors duration-200 border border-gray-200 hover:border-gray-300"
          >
            Skip to Next (Demo)
          </button>
        </div>

        {/* Common Symptoms */}
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 text-base sm:text-lg text-center mb-4 sm:mb-6 px-2">
            Or choose from common symptoms:
          </p>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {symptomOptions.map((symptom, index) => (
              <button
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 text-center group"
              >
                <div className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform flex justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8">
                    {symptom.icon}
                  </div>
                </div>
                <h3 className="text-sm sm:text-lg font-medium text-gray-900">
                  {symptom.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}