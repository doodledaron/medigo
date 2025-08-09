'use client';

import { useEffect, useRef, useState } from 'react';

interface VoiceOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  conversationStatus: 'disconnected' | 'connecting' | 'connected';
}

export function VoiceOrb({ isListening, isSpeaking, onClick, conversationStatus }: VoiceOrbProps) {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    let mounted = true;

    const setupAudioAnalysis = async () => {
      if (!isListening) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
        setVolumeLevel(0);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: false
          } 
        });
        
        if (!mounted) return;
        
        streamRef.current = stream;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const updateVolume = () => {
          if (!mounted || !analyserRef.current) return;
          
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          const normalizedVolume = Math.min(average / 100, 1);
          
          setVolumeLevel(normalizedVolume);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        
        updateVolume();
      } catch (error) {
        console.error('Error setting up audio analysis:', error);
      }
    };

    setupAudioAnalysis();

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isListening]);

  const getOrbSize = () => {
    if (isSpeaking) return 1.2;
    if (isListening) return 1 + (volumeLevel * 0.3);
    return 1;
  };

  const getGlowIntensity = () => {
    if (isSpeaking) return 0.8;
    if (isListening) return 0.4 + (volumeLevel * 0.4);
    return 0.2;
  };

  const getAnimationClass = () => {
    if (isSpeaking) return 'animate-pulse';
    if (conversationStatus === 'connecting') return 'animate-bounce';
    return '';
  };

  return (
    <div className="flex flex-col items-center mb-8 sm:mb-12">
      <button
        onClick={onClick}
        className={`
          relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80
          rounded-full shadow-2xl 
          transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-3xl
          active:scale-95
          focus:outline-none focus:ring-4
          ${getAnimationClass()}
        `}
        style={{
          background: `linear-gradient(to bottom right, var(--tertiary-pink), var(--tertiary-pink-dark))`,
          transform: `scale(${getOrbSize()})`,
          boxShadow: `0 35px 60px -12px rgba(236, 72, 153, ${getGlowIntensity()})`,
          '--tw-ring-color': 'var(--tertiary-pink-light)'
        } as React.CSSProperties}
      >
        {/* Outer glow ring */}
        <div 
          className="absolute -inset-2 sm:-inset-4 rounded-full blur-xl transition-opacity duration-300" 
          style={{
            background: `linear-gradient(to right, var(--tertiary-pink-light), var(--tertiary-pink))`,
            opacity: getGlowIntensity()
          }}
        />
        
        {/* Volume-responsive rings */}
        {isListening && (
          <>
            <div 
              className="absolute inset-0 rounded-full transition-all duration-150 ease-out"
              style={{
                backgroundColor: 'var(--tertiary-pink)',
                opacity: volumeLevel * 0.3,
                transform: `scale(${1 + volumeLevel * 0.2})`
              }}
            />
            <div 
              className="absolute -inset-4 rounded-full transition-all duration-200 ease-out"
              style={{
                backgroundColor: 'var(--tertiary-pink-light)',
                opacity: volumeLevel * 0.2,
                transform: `scale(${1 + volumeLevel * 0.1})`
              }}
            />
          </>
        )}
        
        {/* Speaking pulse rings */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{backgroundColor: 'var(--tertiary-pink)'}} />
            <div className="absolute -inset-2 rounded-full animate-ping opacity-20 animation-delay-75" style={{backgroundColor: 'var(--tertiary-pink-light)'}} />
            <div className="absolute -inset-4 rounded-full animate-ping opacity-10 animation-delay-150" style={{backgroundColor: 'var(--tertiary-pink-light)'}} />
          </>
        )}
        
        {/* Central microphone icon */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <svg 
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-white drop-shadow-lg transition-all duration-200" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{
              filter: `drop-shadow(0 4px 8px rgba(0,0,0,${0.2 + getGlowIntensity() * 0.3}))`
            }}
          >
            <path 
              fillRule="evenodd" 
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        {/* Volume indicator bar (optional visual feedback) */}
        {isListening && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-out rounded-full"
              style={{ width: `${volumeLevel * 100}%` }}
            />
          </div>
        )}
      </button>
      
      {/* Status indicator */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div 
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              conversationStatus === 'connected' ? 'bg-green-400 animate-pulse' :
              conversationStatus === 'connecting' ? 'bg-yellow-400 animate-bounce' :
              'bg-gray-400'
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            {conversationStatus === 'connected' ? 
              (isSpeaking ? 'Agent Speaking' : 'Listening...') :
              conversationStatus === 'connecting' ? 'Connecting...' :
              'Ready to start'
            }
          </span>
        </div>
        
        {isListening && (
          <div className="text-xs text-gray-500">
            Volume: {Math.round(volumeLevel * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}