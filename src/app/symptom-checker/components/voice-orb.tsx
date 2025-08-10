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
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={`
          relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]
          rounded-full shadow-2xl 
          transition-all duration-500 ease-out
          hover:scale-105 hover:shadow-3xl
          active:scale-95
          focus:outline-none focus:ring-8
          ${getAnimationClass()}
          magical-orb-glow
        `}
        style={{
          background: `linear-gradient(135deg, var(--tertiary-pink) 0%, var(--tertiary-pink-dark) 50%, rgba(236, 72, 153, 0.9) 100%)`,
          transform: `scale(${getOrbSize()})`,
          boxShadow: `
            0 0 60px rgba(236, 72, 153, ${getGlowIntensity()}),
            0 0 120px rgba(236, 72, 153, ${getGlowIntensity() * 0.6}),
            0 0 200px rgba(59, 130, 246, ${getGlowIntensity() * 0.4}),
            inset 0 0 60px rgba(255, 255, 255, ${getGlowIntensity() * 0.3}),
            0 35px 80px -12px rgba(236, 72, 153, ${getGlowIntensity()})
          `,
          '--tw-ring-color': 'rgba(236, 72, 153, 0.5)',
          filter: `brightness(${1 + getGlowIntensity() * 0.2}) saturate(${1 + getGlowIntensity() * 0.3})`
        } as React.CSSProperties}
      >
        {/* Multi-layered magical glow rings */}
        <div 
          className="absolute -inset-8 sm:-inset-12 rounded-full blur-3xl transition-all duration-500" 
          style={{
            background: `radial-gradient(circle, rgba(236, 72, 153, ${getGlowIntensity() * 0.6}) 0%, rgba(147, 51, 234, ${getGlowIntensity() * 0.4}) 50%, transparent 100%)`,
            animation: isListening ? 'spin 4s linear infinite' : isSpeaking ? 'pulse 2s ease-in-out infinite' : 'breathe 3s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -inset-6 sm:-inset-8 rounded-full blur-2xl transition-all duration-500" 
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, ${getGlowIntensity() * 0.5}) 0%, rgba(236, 72, 153, ${getGlowIntensity() * 0.3}) 70%, transparent 100%)`,
            animation: isListening ? 'spin 6s linear infinite reverse' : isSpeaking ? 'pulse 1.5s ease-in-out infinite' : 'breathe 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -inset-4 sm:-inset-6 rounded-full blur-xl transition-all duration-500" 
          style={{
            background: `radial-gradient(circle, rgba(255, 255, 255, ${getGlowIntensity() * 0.3}) 0%, transparent 70%)`,
            animation: 'breathe 2s ease-in-out infinite'
          }}
        />
        
        {/* Enhanced Volume-responsive rings */}
        {isListening && (
          <>
            <div 
              className="absolute inset-0 rounded-full transition-all duration-150 ease-out"
              style={{
                background: `radial-gradient(circle, rgba(236, 72, 153, ${volumeLevel * 0.4}) 0%, transparent 70%)`,
                transform: `scale(${1 + volumeLevel * 0.3})`,
                filter: `blur(${volumeLevel * 2}px)`
              }}
            />
            <div 
              className="absolute -inset-6 rounded-full transition-all duration-200 ease-out"
              style={{
                background: `radial-gradient(circle, rgba(147, 51, 234, ${volumeLevel * 0.3}) 0%, transparent 60%)`,
                transform: `scale(${1 + volumeLevel * 0.2})`,
                filter: `blur(${volumeLevel * 3}px)`
              }}
            />
            <div 
              className="absolute -inset-8 rounded-full transition-all duration-250 ease-out"
              style={{
                background: `radial-gradient(circle, rgba(59, 130, 246, ${volumeLevel * 0.2}) 0%, transparent 50%)`,
                transform: `scale(${1 + volumeLevel * 0.15})`,
                filter: `blur(${volumeLevel * 4}px)`
              }}
            />
          </>
        )}
        
        {/* Enhanced Speaking pulse rings */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full animate-ping opacity-50" 
                 style={{background: 'radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, transparent 70%)'}} />
            <div className="absolute -inset-4 rounded-full animate-ping opacity-30 animation-delay-75" 
                 style={{background: 'radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, transparent 60%)'}} />
            <div className="absolute -inset-8 rounded-full animate-ping opacity-20 animation-delay-150" 
                 style={{background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 50%)'}} />
            <div className="absolute -inset-12 rounded-full animate-ping opacity-10 animation-delay-300" 
                 style={{background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 40%)'}} />
          </>
        )}
        
        {/* Enhanced Central microphone icon */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <svg 
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 text-white drop-shadow-2xl transition-all duration-300" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{
              filter: `
                drop-shadow(0 0 20px rgba(255, 255, 255, ${0.8 + getGlowIntensity() * 0.5}))
                drop-shadow(0 8px 16px rgba(0,0,0,${0.3 + getGlowIntensity() * 0.2}))
                drop-shadow(0 0 40px rgba(236, 72, 153, ${getGlowIntensity() * 0.6}))
              `,
              transform: isListening ? `rotate(${volumeLevel * 10}deg)` : isSpeaking ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <path 
              fillRule="evenodd" 
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        {/* Enhanced Volume indicator with magical styling */}
        {isListening && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-100 ease-out rounded-full shadow-lg"
              style={{ 
                width: `${volumeLevel * 100}%`,
                filter: `drop-shadow(0 0 8px rgba(236, 72, 153, ${volumeLevel}))`
              }}
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