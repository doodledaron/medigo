'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AppointmentBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const hospitalName = searchParams.get('hospitalName') || 'Singapore General Hospital';
  const hospitalId = searchParams.get('hospitalId') || '1';
  const doctorName = searchParams.get('doctorName') || 'Dr. James Wong';
  const specialty = searchParams.get('specialty') || 'Neurology Specialist';

  useEffect(() => {
    setMounted(true);
    
    // Simulate booking processing time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Navigate to booking confirmation with all parameters
      const params = new URLSearchParams({
        hospitalId,
        hospitalName,
        doctorName,
        specialty
      });
      router.push(`/ai-doctor-assignment?${params.toString()}`);
    }, 2800);

    return () => clearTimeout(loadingTimer);
  }, [hospitalId, hospitalName, doctorName, specialty, router]);

  const handleBack = () => {
    router.back();
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
            Booking Appointment
          </h1>
        </div>
      </div>

      {/* Loading Animation */}
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center animate-fadeIn">
          <div className="w-24 h-24 mx-auto mb-8 relative">
            {/* Animated appointment book icon */}
            <div className="absolute inset-0 border-4 border-blue-200 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-2 border-4 border-blue-400 rounded-xl animate-ping"></div>
            <div className="absolute inset-4 bg-blue-500 rounded-lg flex items-center justify-center animate-bounce">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Confirming Your Appointment</h2>
            <div className="space-y-3 text-gray-600 max-w-md mx-auto">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="font-medium text-gray-900">{doctorName}</p>
                <p className="text-blue-600 text-sm">{specialty}</p>
                <p className="text-gray-600 text-sm mt-1">{hospitalName}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="animate-typewriter">Processing your booking...</p>
                <p className="animate-typewriter" style={{animationDelay: '1s'}}>Confirming availability...</p>
                <p className="animate-typewriter" style={{animationDelay: '2s'}}>Finalizing appointment details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typewriter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-typewriter {
          animation: typewriter 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default function AppointmentBooking() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AppointmentBookingContent />
    </Suspense>
  );
}