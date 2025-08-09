'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NFCEntranceScan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hospitalName = searchParams.get('hospitalName') || 'Singapore General Hospital';
  const hospitalId = searchParams.get('hospitalId') || '1';
  const doctorName = searchParams.get('doctorName') || 'Dr. James Wong';
  const specialty = searchParams.get('specialty') || 'Neurology Specialist';
  const queuePosition = searchParams.get('queuePosition') || '3';
  const estimatedWait = searchParams.get('estimatedWait') || '25 min';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleStartScan = () => {
    setIsScanning(true);
    
    // Simulate NFC scanning process
    setTimeout(() => {
      setScanComplete(true);
      setIsScanning(false);
    }, 3000);
  };

  const handleScanComplete = () => {
    const params = new URLSearchParams({
      hospitalId,
      hospitalName,
      doctorName,
      specialty,
      queuePosition,
      estimatedWait
    });
    router.push(`/indoor-navigation?${params.toString()}`);
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
            Main Entrance Check-in
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-md mx-auto">
          {/* NFC Icon */}
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className={`absolute inset-0 rounded-full ${isScanning ? 'bg-blue-100 animate-ping' : 'bg-blue-50'} transition-all duration-300`}></div>
            <div className={`absolute inset-4 rounded-full ${isScanning ? 'bg-blue-200 animate-pulse' : 'bg-blue-100'} transition-all duration-300`}></div>
            <div className={`absolute inset-8 rounded-full ${isScanning ? 'bg-blue-300 animate-bounce' : 'bg-blue-200'} flex items-center justify-center transition-all duration-300`}>
              {scanComplete ? (
                <svg className="w-12 h-12 text-green-600 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
              ) : (
                <div className="relative">
                  {/* NFC Symbol - Wave lines */}
                  <div className="flex space-x-1">
                    <div className={`w-1 bg-blue-600 rounded-full ${isScanning ? 'h-8 animate-pulse' : 'h-6'} transition-all duration-300`}></div>
                    <div className={`w-1 bg-blue-600 rounded-full ${isScanning ? 'h-10 animate-pulse' : 'h-8'} transition-all duration-300`} style={{animationDelay: '0.2s'}}></div>
                    <div className={`w-1 bg-blue-600 rounded-full ${isScanning ? 'h-12 animate-pulse' : 'h-10'} transition-all duration-300`} style={{animationDelay: '0.4s'}}></div>
                    <div className={`w-1 bg-blue-600 rounded-full ${isScanning ? 'h-10 animate-pulse' : 'h-8'} transition-all duration-300`} style={{animationDelay: '0.6s'}}></div>
                    <div className={`w-1 bg-blue-600 rounded-full ${isScanning ? 'h-8 animate-pulse' : 'h-6'} transition-all duration-300`} style={{animationDelay: '0.8s'}}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {scanComplete ? 'Scan Complete!' : isScanning ? 'Scanning...' : 'Scan Department NFC'}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              {scanComplete 
                ? 'Welcome to the hospital! You have successfully checked in at the main entrance.' 
                : isScanning 
                ? 'Please hold your phone steady near the NFC tag...' 
                : 'Hold your phone near the NFC tag at the department reception'
              }
            </p>

            {/* Appointment Info Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Doctor:</span>
                  <span className="font-semibold text-gray-900">{doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Specialty:</span>
                  <span className="font-semibold text-blue-600">{specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Queue:</span>
                  <span className="font-semibold text-gray-900">#{queuePosition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wait Time:</span>
                  <span className="font-semibold text-gray-900">{estimatedWait}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              {scanComplete ? (
                <button
                  onClick={handleScanComplete}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8v2h-8v-2zm0 4h8v2h-8v-2zm6 4h2v2h-2v-2zm-6 0h4v2h-4v-2zM3 5v14c0 1.1.9 2 2 2h6V3H5c-1.1 0-2 .9-2 2zm6 12H5v-2h4v2zm0-4H5v-2h4v2zm0-4H5V7h4v2z"/>
                  </svg>
                  Proceed to Navigation
                </button>
              ) : (
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className={`w-full font-semibold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center ${
                    isScanning 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isScanning ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 14.5c0-1.5 1.5-3 3-3s3 1.5 3 3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8.5v3" />
                      </svg>
                      Start Department Scan
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}