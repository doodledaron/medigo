"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function NFCCheckpointScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [scannedData, setScannedData] = useState<string | null>(null);

  // Store the current NDEFReader so we can stop/reset it
  const ndefRef = useRef<any>(null);

  const hospitalName =
    searchParams.get("hospitalName") || "Singapore General Hospital";
  const hospitalId = searchParams.get("hospitalId") || "1";
  const doctorName = searchParams.get("doctorName") || "Dr. James Wong";
  const specialty = searchParams.get("specialty") || "Neurology Specialist";
  const queuePosition = searchParams.get("queuePosition") || "3";
  const estimatedWait = searchParams.get("estimatedWait") || "25 min";
  const etaToHospital = searchParams.get("etaToHospital") || "15 min";
  const waitingTimeIfOnTime =
    searchParams.get("waitingTimeIfOnTime") || "10 min";
  const checkpoint = searchParams.get("checkpoint") || "2";
  const nextStep = searchParams.get("nextStep") || "2";

  const checkpointData = {
    "2": {
      title: "Checkpoint 1: Registration Area",
      subtitle: "Scan NFC at Registration Area",
      description: "Hold your phone near the NFC tag at the elevator area",
      instruction:
        "Great! You've reached the elevator area. Please scan to continue.",
      icon: "🛗",
      color: "blue",
    },
    "3": {
      title: "Destination: Department Reception",
      subtitle: "Final Destination Scan",
      description:
        "Hold your phone near the NFC tag at the department reception",
      instruction:
        "You've arrived at the Neurology Department. Please scan to check in.",
      icon: "🏥",
      color: "green",
    },
  };

  const currentCheckpoint =
    checkpointData[checkpoint as keyof typeof checkpointData];

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

  // const handleStartScan = async () => {
  //   try {
  //     if (!("NDEFReader" in window)) {
  //       alert("Web NFC is not supported on this device/browser.");
  //       return;
  //     }

  //     setIsScanning(true);
  //     setScanComplete(false);
  //     setScannedData(null);

  //     // If there’s an old reader, stop it
  //     if (ndefRef.current) {
  //       ndefRef.current.onreading = null;
  //       try {
  //         await ndefRef.current.abort?.();
  //       } catch {}
  //     }

  //     const ndef = new (window as any).NDEFReader();
  //     ndefRef.current = ndef;

  //     await ndef.scan();

  //     // Ensure only ONE listener is active
  //     ndef.onreading = (event: any) => {
  //       const decoder = new TextDecoder();
  //       let tagContent = "";
  //       for (const record of event.message.records) {
  //         tagContent += decoder.decode(record.data) + "\n";
  //       }

  //       const lines = tagContent.trim().split("\n");
  //       const data: Record<string, string> = {};
  //       lines.forEach((line) => {
  //         const [key, value] = line.split(":");
  //         data[key] = value;
  //       });

  //       if (data.CPID === "MAIN_ENTRANCE") {
  //         setScanComplete(true);
  //         setScannedData(tagContent);
  //       } else {
  //         setScanComplete(false);
  //         alert("Invalid checkpoint tag. Please try again.");
  //       }

  //       // Stop scanning after reading once
  //       ndef.onreading = null;
  //       setIsScanning(false);
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     setIsScanning(false);
  //   }
  // };

  const handleScanComplete = () => {
    if (checkpoint === "3") {
      // Final checkpoint - navigate to queue status page
      const params = new URLSearchParams({
        hospitalId,
        hospitalName,
        doctorName,
        specialty,
        queuePosition,
        estimatedWait,
      });
      router.push(`/queue-status?${params.toString()}`);
    } else {
      // Return to navigation page with updated step
      const params = new URLSearchParams({
        hospitalId,
        hospitalName,
        doctorName,
        specialty,
        queuePosition,
        estimatedWait,
        etaToHospital,
        waitingTimeIfOnTime,
        step: nextStep,
      });
      router.push(`/indoor-navigation?${params.toString()}`);
    }
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
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentCheckpoint.title}
            </h1>
            <p className="text-sm text-gray-500">
              Checkpoint {checkpoint} of 3
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              checkpoint === "3" ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${(parseInt(checkpoint) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[65vh] px-4">
        <div className="text-center max-w-md mx-auto">
          {/* NFC Icon */}
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 ${
                isScanning
                  ? `${
                      checkpoint === "3" ? "bg-green-100" : "bg-blue-100"
                    } animate-ping`
                  : `${checkpoint === "3" ? "bg-green-50" : "bg-blue-50"}`
              }`}
            ></div>
            <div
              className={`absolute inset-4 rounded-full transition-all duration-300 ${
                isScanning
                  ? `${
                      checkpoint === "3" ? "bg-green-200" : "bg-blue-200"
                    } animate-pulse`
                  : `${checkpoint === "3" ? "bg-green-100" : "bg-blue-100"}`
              }`}
            ></div>
            <div
              className={`absolute inset-8 rounded-full transition-all duration-300 flex items-center justify-center ${
                isScanning
                  ? `${
                      checkpoint === "3" ? "bg-green-300" : "bg-blue-300"
                    } animate-bounce`
                  : `${checkpoint === "3" ? "bg-green-200" : "bg-blue-200"}`
              }`}
            >
              {scanComplete ? (
                <svg
                  className="w-12 h-12 text-green-600 animate-bounce"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
              ) : (
                <div className="text-3xl">{currentCheckpoint.icon}</div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {scanComplete
                ? "Scan Complete!"
                : isScanning
                ? "Scanning..."
                : currentCheckpoint.subtitle}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              {scanComplete
                ? checkpoint === "3"
                  ? "Welcome to the Neurology Department! You have successfully checked in."
                  : "Checkpoint confirmed! You can now proceed to the next step."
                : isScanning
                ? "Please hold your phone steady near the NFC tag..."
                : currentCheckpoint.description}
            </p>

            {/* Instruction Card */}
            <div
              className={`rounded-xl p-4 border-2 ${
                checkpoint === "3"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start">
                <svg
                  className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                    checkpoint === "3" ? "text-green-600" : "text-blue-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p
                  className={`font-medium ${
                    checkpoint === "3" ? "text-green-800" : "text-blue-800"
                  }`}
                >
                  {currentCheckpoint.instruction}
                </p>
              </div>
            </div>

            {/* Appointment Info Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Doctor:</span>
                  <span className="font-semibold text-gray-900">
                    {doctorName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span
                    className={`font-semibold ${
                      checkpoint === "3" ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    {specialty}
                  </span>
                </div>
                {checkpoint === "3" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Queue Position:</span>
                      <span className="font-semibold text-gray-900">
                        #{queuePosition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Waiting Time:</span>
                      <span className="font-semibold text-gray-900">
                        {estimatedWait}
                      </span>
                    </div>
                  </>
                )}
                {checkpoint === "2" && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hospital:</span>
                    <span className="font-semibold text-gray-900">
                      {hospitalName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              {scanComplete ? (
                <button
                  onClick={handleScanComplete}
                  className={`w-full font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center ${
                    checkpoint === "3"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {checkpoint === "3" ? (
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    ) : (
                      <path d="M13 7h8v2h-8v-2zm0 4h8v2h-8v-2zm6 4h2v2h-2v-2zm-6 0h4v2h-4v-2zM3 5v14c0 1.1.9 2 2 2h6V3H5c-1.1 0-2 .9-2 2zm6 12H5v-2h4v2zm0-4H5v-2h4v2zm0-4H5V7h4v2z" />
                    )}
                  </svg>
                  {checkpoint === "3"
                    ? "View Queue Status"
                    : "Continue Navigation"}
                </button>
              ) : (
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className={`w-full font-semibold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center ${
                    isScanning
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : checkpoint === "3"
                      ? "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isScanning ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18.5c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.5 14.5c0-1.5 1.5-3 3-3s3 1.5 3 3"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8.5v3"
                        />
                      </svg>
                      Scan NFC Tag
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
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function NFCCheckpointScan() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <NFCCheckpointScanContent />
    </Suspense>
  );
}
