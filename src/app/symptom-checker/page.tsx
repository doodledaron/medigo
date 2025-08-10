'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Conversation } from './components/conversation';
import { VoiceOrb } from './components/voice-orb';

export default function SymptomChecker() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [conversationStatus, setConversationStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [isEntering, setIsEntering] = useState(true);
  const [showEntranceEffects, setShowEntranceEffects] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const conversation = Conversation({
    isListening,
    onConversationStart: () => {
      setIsListening(true);
      setConversationStatus('connected');
    },
    onConversationEnd: async () => {
      setIsListening(false);
      setConversationStatus('disconnected');
      setIsProcessing(true); // Show loading state
      
      // Send completion POST request and get response
      try {
        const response = await fetch('https://doodledaron.app.n8n.cloud/webhook/39e888c9-8fb0-4ebc-af3b-8afc06f27338', {
          method: 'POST',
          body: ""
        });
        
        const responseText = await response.text();
        console.log('Webhook response status:', response.status);
        console.log('Webhook response:', responseText);
        
        // Try to parse as JSON if it's not empty
        if (responseText.trim()) {
          try {
            const data = JSON.parse(responseText);
            console.log('Webhook response (parsed):', data);
            
            // Store data for assessment results page
            localStorage.setItem('assessmentData', JSON.stringify(data));
            
            // Navigate to results after getting response
            router.push('/assessment-results');
          } catch (jsonError) {
            console.log('Response is not JSON:', responseText);
            setIsProcessing(false);
          }
        } else {
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Failed to send completion webhook:', error);
        setIsProcessing(false);
      }
    },
  });

  const handleMicClick = () => {
    if (conversationStatus === 'connected') {
      conversation.stopConversation();
    } else {
      setConversationStatus('connecting');
      conversation.startConversation();
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Magical entrance animation on page load
  useEffect(() => {
    // Start entrance animation sequence
    setTimeout(() => {
      setIsEntering(false);
    }, 500);
    
    setTimeout(() => {
      setShowEntranceEffects(false);
    }, 2000);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center transition-all duration-700 ${isEntering ? 'magical-entrance' : ''} magical-background relative overflow-hidden`} style={{backgroundColor: 'var(--primary-blue-light)'}}>
      
      {/* Hidden back button for accessibility */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-3 text-gray-400 hover:text-gray-600 transition-all duration-300 z-10 opacity-20 hover:opacity-60 backdrop-blur-sm rounded-full hover:bg-white/10"
        aria-label="Go back"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-pink-200/30 via-purple-200/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-blue-200/30 via-indigo-200/20 to-transparent rounded-full blur-2xl animate-pulse animation-delay-75" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-radial from-white/20 to-transparent rounded-full blur-xl animate-breathe" />
      </div>

      {/* Centered Magical Voice Orb */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Enhanced Glowing Shadow Base */}
        <div className="absolute inset-0 -m-40 bg-gradient-radial from-pink-300/40 via-purple-200/20 to-transparent rounded-full blur-3xl animate-breathe" />
        <div className="absolute inset-0 -m-32 bg-gradient-radial from-blue-300/40 via-indigo-200/20 to-transparent rounded-full blur-2xl animate-breathe animation-delay-150" />
        <div className="absolute inset-0 -m-24 bg-gradient-radial from-white/30 to-transparent rounded-full blur-xl animate-pulse" />
        
        {/* Voice Orb Container with enhanced entrance effects */}
        <div className={`relative transition-all duration-1000 ${isEntering ? 'scale-150 opacity-0' : 'scale-100 opacity-100'} ${showEntranceEffects ? 'magical-entrance-orb' : ''}`}>
          <VoiceOrb
            isListening={isListening}
            isSpeaking={conversation.status === 'connected' && conversation.isSpeaking}
            onClick={handleMicClick}
            conversationStatus={conversationStatus}
          />
          
          {/* Enhanced Entrance particle effects */}
          {showEntranceEffects && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Primary particle ring */}
              <div className="absolute -inset-32">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full animate-entrance-particle shadow-lg"
                    style={{
                      left: `${50 + 45 * Math.cos(i * 15 * Math.PI / 180)}%`,
                      top: `${50 + 45 * Math.sin(i * 15 * Math.PI / 180)}%`,
                      animationDelay: `${i * 50}ms`,
                      animationDuration: '2.5s',
                      filter: 'drop-shadow(0 0 6px rgba(236, 72, 153, 0.6))'
                    }}
                  />
                ))}
              </div>
              {/* Secondary sparkle ring */}
              <div className="absolute -inset-40">
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i + 24}
                    className="absolute w-2 h-2 bg-white rounded-full animate-entrance-sparkle"
                    style={{
                      left: `${50 + 55 * Math.cos(i * 20 * Math.PI / 180)}%`,
                      top: `${50 + 55 * Math.sin(i * 20 * Math.PI / 180)}%`,
                      animationDelay: `${500 + i * 70}ms`,
                      animationDuration: '2s',
                      filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
                    }}
                  />
                ))}
              </div>
              {/* Outer mystical ring */}
              <div className="absolute -inset-48">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i + 42}
                    className="absolute w-1.5 h-1.5 bg-gradient-to-r from-indigo-300 to-pink-300 rounded-full animate-sparkle"
                    style={{
                      left: `${50 + 65 * Math.cos(i * 30 * Math.PI / 180)}%`,
                      top: `${50 + 65 * Math.sin(i * 30 * Math.PI / 180)}%`,
                      animationDelay: `${800 + i * 100}ms`,
                      animationDuration: '3s',
                      filter: 'blur(0.5px)'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Elegant Status Text */}
        <div className="mt-12 text-center max-w-md">
          <p className={`text-2xl sm:text-3xl font-light transition-all duration-700 ${isEntering ? 'opacity-0 scale-95 translate-y-8' : 'opacity-100 scale-100 translate-y-0'}`} 
             style={{color: 'var(--neutral-700)'}}>
            {conversationStatus === 'connected' 
              ? (conversation.isSpeaking ? '🎙️ AI is speaking...' : '👂 Listening to you...')
              : conversationStatus === 'connecting' 
              ? '✨ Connecting to AI...'
              : '💬 Tap to start conversation'
            }
          </p>
          
          {conversationStatus === 'disconnected' && (
            <p className="mt-4 text-gray-500 text-base animate-fade-in-up animation-delay-300 font-light">
              Example: "I have chest pain since yesterday"
            </p>
          )}
          
          {/* Subtle breathing indicator */}
          {conversationStatus === 'connected' && !conversation.isSpeaking && (
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Stop conversation button */}
          {conversationStatus === 'connected' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => conversation.stopConversation()}
                className="px-8 py-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-red-400/30"
                style={{
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.4), 0 8px 25px rgba(239, 68, 68, 0.2)',
                  filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))'
                }}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  <span>Stop Conversation</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI is gathering information</h3>
            <p className="text-gray-600 text-sm">Please wait while we process your symptoms...</p>
          </div>
        </div>
      )}
    </div>
  );
}