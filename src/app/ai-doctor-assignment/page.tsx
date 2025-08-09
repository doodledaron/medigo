'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface AssignedDoctor {
  name: string;
  specialty: string;
  department: string;
  rating: number;
  queuePosition: number;
  estimatedWait: string;
  etaToHospital: string;
  waitingTimeIfOnTime: string;
}

function AIDoctorAssignmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hospitalName = searchParams.get('hospitalName') || 'Singapore General Hospital';
  const hospitalId = searchParams.get('hospitalId') || '1';
  
  // Check if doctor was pre-selected from doctor selection page
  const preSelectedDoctorName = searchParams.get('doctorName');
  const preSelectedSpecialty = searchParams.get('specialty');
  const isDoctorPreSelected = !!(preSelectedDoctorName && preSelectedSpecialty);

  // Use pre-selected doctor info or default AI assignment
  const assignedDoctor: AssignedDoctor = {
    name: preSelectedDoctorName || 'Dr. James Wong',
    specialty: preSelectedSpecialty || 'Neurology Specialist',
    department: preSelectedSpecialty || 'Neurology Department',
    rating: 4.8,
    queuePosition: 3,
    estimatedWait: '25 min',
    etaToHospital: '15 min',
    waitingTimeIfOnTime: '10 min'
  };

  // Mock patient data
  const patientInfo = {
    name: 'Uncle Tan',
    phone: '+65 9123 4567',
    insurance: 'Great Eastern'
  };

  useEffect(() => {
    setMounted(true);
    
    if (isDoctorPreSelected) {
      // Skip AI loading if doctor was pre-selected
      setIsLoading(false);
      setShowConfirmation(true);
    } else {
      // Simulate AI processing time only when no doctor is pre-selected
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        setShowConfirmation(true);
      }, 2500);

      return () => clearTimeout(loadingTimer);
    }
  }, [isDoctorPreSelected]);

  const handleBack = () => {
    router.back();
  };

  const handleGetDirections = () => {
    // Open maps app
    window.open('https://maps.google.com/?q=Singapore+General+Hospital+Outram+Road');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleNFCScan = () => {
    const params = new URLSearchParams({
      hospitalId,
      hospitalName,
      doctorName: assignedDoctor.name,
      specialty: assignedDoctor.specialty,
      queuePosition: assignedDoctor.queuePosition.toString(),
      estimatedWait: assignedDoctor.estimatedWait,
      etaToHospital: assignedDoctor.etaToHospital,
      waitingTimeIfOnTime: assignedDoctor.waitingTimeIfOnTime
    });
    router.push(`/nfc-entrance-scan?${params.toString()}`);
  };

  if (!mounted) return null;

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
          <h1 className="text-xl font-semibold text-gray-900">
            {isLoading ? 'AI Assignment' : 'Booking Confirmation'}
          </h1>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-8 relative">
              {/* Animated circles */}
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 border-4 border-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">AI Finding Best Doctor</h2>
              <div className="space-y-2 text-gray-600 max-w-sm mx-auto">
                <p className="animate-typewriter">Analyzing your needs...</p>
                <p className="animate-typewriter" style={{animationDelay: '1s'}}>Checking doctor availability...</p>
                <p className="animate-typewriter" style={{animationDelay: '2s'}}>Optimizing your wait time...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation State */}
      {showConfirmation && (
        <div className={`px-4 py-8 transition-all duration-700 ${showConfirmation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Success Message */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-center animate-slideUp">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4h4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2h4zM8 7h8V3H8v4zm8 2H8v10h8V9z"/>
                <path d="M9 11h6v2H9v-2zm0 4h4v2H9v-2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
            <p className="text-green-700 text-lg">Your appointment has been scheduled successfully</p>
          </div>

          {/* Patient Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-slideUp" style={{animationDelay: '200ms'}}>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold text-gray-900">{patientInfo.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Phone:</span>
                <span className="font-semibold text-gray-900">{patientInfo.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Insurance:</span>
                <span className="font-semibold text-gray-900">{patientInfo.insurance}</span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-slideUp" style={{animationDelay: '400ms'}}>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{hospitalName}</h4>
                <p className="text-gray-600">Outram Road</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{assignedDoctor.name}</h4>
                <p className="text-blue-600 font-medium">{assignedDoctor.department}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ETA to Hospital</p>
                    <p className="font-semibold text-gray-900">{assignedDoctor.etaToHospital}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Waiting Time if Reached Within</p>
                    <p className="font-semibold text-gray-900">{assignedDoctor.waitingTimeIfOnTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 animate-slideUp" style={{animationDelay: '600ms'}}>
            <button
              onClick={handleNFCScan}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 14.5c0-1.5 1.5-3 3-3s3 1.5 3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8.5v3" />
              </svg>
              Click here to scan NFC when u arrived!
            </button>

            <button
              onClick={handleGetDirections}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 12l4.5-4.5L17.5 12 13 16.5z"/>
                <path d="M12 2l8 20-8-6-8 6 8-20z"/>
              </svg>
              Get Directions
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Back to Home
            </button>
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

        @keyframes typewriter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-typewriter {
          animation: typewriter 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default function AIDoctorAssignment() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AIDoctorAssignmentContent />
    </Suspense>
  );
}