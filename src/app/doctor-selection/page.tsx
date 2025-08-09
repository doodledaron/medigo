'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Hospital {
  id: string;
  name: string;
  address: string;
  type: 'public' | 'private';
  specialties: string[];
}

function DoctorSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get hospital info from URL params or default
  const hospitalId = searchParams.get('hospitalId') || '1';
  const hospitalName = searchParams.get('hospitalName') || 'Singapore General Hospital';
  const hospitalAddress = searchParams.get('hospitalAddress') || 'Outram Road';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleOptionSelect = (option: 'ai' | 'manual') => {
    if (selectedOption === option) return;
    
    setSelectedOption(option);
    setIsAnimating(true);
    
    // Simulate selection and navigation delay for smooth UX
    setTimeout(() => {
      if (option === 'ai') {
        router.push(`/ai-doctor-assignment?hospitalId=${hospitalId}&hospitalName=${encodeURIComponent(hospitalName)}`);
      } else {
        router.push(`/doctor-list?hospitalId=${hospitalId}&hospitalName=${encodeURIComponent(hospitalName)}`);
      }
    }, 600);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--primary-blue-light)'}}>
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Doctor Selection</h1>
        </div>
      </div>

      {/* Content */}
      <div className={`px-4 py-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Hospital Info */}
        <div className="mb-12 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{hospitalName}</h2>
          <p className="text-gray-600 text-lg">{hospitalAddress}</p>
        </div>

        {/* Main Question */}
        <div className="mb-12 text-center animate-slideUp">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Any preference for doctor?</h3>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            We can help you choose the best doctor for your needs
          </p>
        </div>

        {/* Options */}
        <div className="space-y-6 max-w-lg mx-auto">
          {/* AI Selection Option */}
          <button
            onClick={() => handleOptionSelect('ai')}
            disabled={isAnimating}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              selectedOption === 'ai'
                ? 'shadow-lg scale-[1.02]'
                : 'hover:shadow-md'
            } ${isAnimating && selectedOption === 'ai' ? 'animate-pulse' : ''}`}
            style={{
              borderColor: selectedOption === 'ai' ? 'var(--primary-blue)' : 'var(--primary-blue-light)',
              backgroundColor: 'var(--primary-blue-light)',
              ...(selectedOption !== 'ai' && {
                borderColor: 'var(--primary-blue-light)'
              })
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                selectedOption === 'ai' ? 'scale-110' : ''
              }`} style={{backgroundColor: 'var(--primary-blue)'}}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2 transition-colors duration-300" style={{color: 'var(--primary-blue)'}}>
                No, let AI choose for me
              </h4>
              <p className="text-base" style={{color: 'var(--primary-blue)'}}>
                We'll assign the best available doctor
              </p>
              {selectedOption === 'ai' && (
                <div className="mt-3 flex items-center animate-fadeIn" style={{color: 'var(--primary-blue)'}}>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              )}
            </div>
          </button>

          {/* Manual Selection Option */}
          <button
            onClick={() => handleOptionSelect('manual')}
            disabled={isAnimating}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              selectedOption === 'manual'
                ? 'shadow-lg scale-[1.02]'
                : 'hover:shadow-md'
            } ${isAnimating && selectedOption === 'manual' ? 'animate-pulse' : ''}`}
            style={{
              borderColor: selectedOption === 'manual' ? 'var(--tertiary-pink-dark)' : 'var(--tertiary-pink-light)',
              backgroundColor: selectedOption === 'manual' ? 'var(--tertiary-pink-light)' : 'white'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                selectedOption === 'manual' ? 'scale-110' : ''
              }`} style={{backgroundColor: 'var(--tertiary-pink-dark)'}}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h4 className={`text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 ${
                selectedOption === 'manual' ? 'text-gray-800' : 'text-gray-900'
              }`}>
                Yes, I want to choose
              </h4>
              <p className="text-gray-600 text-base">
                Select department and doctor
              </p>
              {selectedOption === 'manual' && (
                <div className="mt-3 flex items-center text-gray-600 animate-fadeIn">
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium">Loading options...</span>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isAnimating && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-xl animate-slideUp">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 font-medium">Redirecting...</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function DoctorSelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DoctorSelectionContent />
    </Suspense>
  );
}