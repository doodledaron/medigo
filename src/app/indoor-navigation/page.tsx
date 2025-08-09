'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface NavigationStep {
  id: number;
  title: string;
  description: string;
  instruction: string;
}

export default function IndoorNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get('step');
    return step ? parseInt(step) : 1;
  });
  const [mounted, setMounted] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const hospitalName = searchParams.get('hospitalName') || 'Singapore General Hospital';
  const hospitalId = searchParams.get('hospitalId') || '1';
  const doctorName = searchParams.get('doctorName') || 'Dr. James Wong';
  const specialty = searchParams.get('specialty') || 'Neurology Specialist';
  const queuePosition = searchParams.get('queuePosition') || '3';
  const estimatedWait = searchParams.get('estimatedWait') || '25 min';
  const etaToHospital = searchParams.get('etaToHospital') || '15 min';
  const waitingTimeIfOnTime = searchParams.get('waitingTimeIfOnTime') || '10 min';

  const navigationSteps: NavigationStep[] = [
    {
      id: 1,
      title: 'Main Entrance to Elevator',
      description: 'Walk straight ahead to the elevator bank',
      instruction: 'Continue straight through the main lobby, past the information desk'
    },
    {
      id: 2,
      title: 'Elevator Area (Checkpoint 2)',
      description: 'You have reached the elevator area - scan NFC to continue',
      instruction: 'Scan the NFC tag at the elevator area to confirm your location'
    },
    {
      id: 3,
      title: 'Final Destination',
      description: 'Navigate to your department and scan at reception',
      instruction: 'Take elevator to Level 3, turn right to Neurology Department'
    }
  ];

  const totalSteps = navigationSteps.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // After step 1, need to scan at checkpoint 2
      const params = new URLSearchParams({
        hospitalId,
        hospitalName,
        doctorName,
        specialty,
        queuePosition,
        estimatedWait,
        etaToHospital,
        waitingTimeIfOnTime,
        checkpoint: '2',
        nextStep: '2'
      });
      router.push(`/nfc-checkpoint-scan?${params.toString()}`);
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlayVideo = () => {
    setVideoPlaying(true);
    // Simulate video playing
    setTimeout(() => {
      setVideoPlaying(false);
    }, 5000);
  };

  const handleCompleteNavigation = () => {
    router.push('/');
  };

  if (!mounted) return null;

  const currentStepData = navigationSteps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Indoor Navigation
            </h1>
            <p className="text-sm text-gray-500">
              Checkpoint {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Current Step Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slideUp">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl font-bold text-blue-600">{currentStep}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
              <p className="text-gray-600 mt-1">{currentStepData.description}</p>
            </div>
          </div>

          {/* Instruction */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-800 font-medium">{currentStepData.instruction}</p>
            </div>
          </div>

          {/* Navigation Video */}
          <div className="bg-gray-800 rounded-xl overflow-hidden relative">
            <div className="aspect-video flex items-center justify-center">
              {videoPlaying ? (
                <div className="text-white text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg">Playing Navigation Video...</p>
                  <p className="text-sm text-gray-300 mt-1">Duration: 45 seconds</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">Navigation Video</h3>
                  <p className="text-gray-300">Duration: 45 seconds</p>
                </div>
              )}
            </div>
          </div>

          {/* Play Video Button */}
          <button
            onClick={handlePlayVideo}
            disabled={videoPlaying}
            className={`w-full mt-4 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center ${
              videoPlaying 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            {videoPlaying ? 'Playing Video...' : 'Play Video'}
          </button>
        </div>

        {/* Appointment Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Your Appointment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Doctor:</span>
              <span className="font-medium text-gray-900">{doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Department:</span>
              <span className="font-medium text-blue-600">{specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Queue Position:</span>
              <span className="font-medium text-gray-900">#{queuePosition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Est. Wait:</span>
              <span className="font-medium text-gray-900">{estimatedWait}</span>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          )}
          
          {currentStep === 1 ? (
            <button
              onClick={handleNextStep}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              Proceed to Checkpoint 2
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : currentStep === 2 ? (
            <button
              onClick={() => {
                const params = new URLSearchParams({
                  hospitalId,
                  hospitalName,
                  doctorName,
                  specialty,
                  queuePosition,
                  estimatedWait,
                  etaToHospital,
                  waitingTimeIfOnTime,
                  checkpoint: '3',
                  nextStep: '3'
                });
                router.push(`/nfc-checkpoint-scan?${params.toString()}`);
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              Proceed to Final Destination
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleCompleteNavigation}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              Complete Navigation
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
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
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}