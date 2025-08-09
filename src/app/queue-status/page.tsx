'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function QueueStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [currentQueue, setCurrentQueue] = useState(7);
  const [peopleAhead, setPeopleAhead] = useState(3);
  const [estimatedWait, setEstimatedWait] = useState(45);
  const [patientsLeft, setPatientsLeft] = useState(3);

  const hospitalName = searchParams.get('hospitalName') || 'Singapore General Hospital';
  const doctorName = searchParams.get('doctorName') || 'Dr. Michael Tan';
  const specialty = searchParams.get('specialty') || 'Cardiology Specialist';

  // Generate queue number based on original queue position
  const originalQueuePosition = parseInt(searchParams.get('queuePosition') || '3');
  const queueNumber = `A${String(originalQueuePosition + 4).padStart(2, '0')}`;

  useEffect(() => {
    setMounted(true);

    // Simulate real-time queue updates
    const interval = setInterval(() => {
      // Randomly update queue status to simulate movement
      if (Math.random() < 0.3) { // 30% chance of update every 5 seconds
        setPeopleAhead(prev => Math.max(0, prev - 1));
        setEstimatedWait(prev => Math.max(5, prev - Math.floor(Math.random() * 10)));
        setPatientsLeft(prev => prev + Math.floor(Math.random() * 2));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-xl font-semibold text-gray-900">Queue Status</h1>
              <p className="text-sm text-gray-500">{hospitalName}</p>
            </div>
          </div>
          <button
            onClick={handleGoHome}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Queue Number Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-center text-white shadow-lg animate-slideUp">
          <h2 className="text-lg font-medium mb-2 opacity-90">Your Queue Number</h2>
          <div className="text-6xl font-bold mb-3 tracking-wider">{queueNumber}</div>
          <p className="text-blue-100 text-sm">Please keep this number visible</p>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-2 gap-4 animate-slideUp" style={{animationDelay: '200ms'}}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{peopleAhead}</div>
            <p className="text-gray-500 text-sm">people ahead</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{estimatedWait}m</div>
            <p className="text-gray-500 text-sm">estimated wait</p>
          </div>
        </div>

        {/* Queue Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slideUp" style={{animationDelay: '400ms'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Queue Status</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">{patientsLeft}</span>
              <span>patients left</span>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
              <div>
                <p className="font-semibold text-yellow-800">Waiting</p>
                <p className="text-yellow-700 text-sm">Please stay in the waiting area</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slideUp" style={{animationDelay: '600ms'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Doctor Today</h3>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 text-lg">{doctorName}</h4>
                <p className="text-green-700">{specialty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Updates Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-slideUp" style={{animationDelay: '800ms'}}>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-blue-800 mb-1">Live Updates</p>
              <p className="text-blue-700 text-sm leading-relaxed">
                This page updates automatically. You'll receive a notification when it's almost your turn.
                Please remain in the waiting area and keep your queue number visible.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="text-center animate-slideUp" style={{animationDelay: '1000ms'}}>
          <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200">
            Need help? Contact reception
          </button>
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
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default function QueueStatus() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <QueueStatusContent />
    </Suspense>
  );
}