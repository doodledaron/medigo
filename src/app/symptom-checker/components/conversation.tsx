'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';

interface ConversationProps {
  isListening: boolean;
  onConversationStart: () => void;
  onConversationEnd: () => void;
}

export function Conversation({ isListening, onConversationStart, onConversationEnd }: ConversationProps) {
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      onConversationStart();
    },
    onDisconnect: () => {
      console.log('Disconnected');
      onConversationEnd();
    },
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
    onDebug: (message) => console.log('Debug:', message),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: 'agent_7501k27pgrddezy8ewpp628zrpem', // or 'YOUR_AGENT_ID'
        connectionType: "webrtc",                   // or "websocket"
        // userId: "YOUR_CUSTOMER_USER_ID",            // optional
      });
      

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return {
    startConversation,
    stopConversation,
    status: conversation.status,
    isSpeaking: conversation.isSpeaking
  };
}