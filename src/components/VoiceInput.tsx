'use client';

import { useState, useEffect } from 'react';

interface VoiceInputProps {
  onResult: (transcript: string) => void;
}

export function VoiceInput({ onResult }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={startListening}
      disabled={isListening}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isListening 
          ? 'bg-red-500 animate-pulse' 
          : 'bg-white/10 hover:bg-white/20 border border-white/20'
      }`}
      title="Voice input"
    >
      <span className="text-xl">{isListening ? '🔴' : '🎤'}</span>
    </button>
  );
}
