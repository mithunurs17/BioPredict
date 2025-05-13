import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  className?: string;
  lang?: string;
  rate?: number;
  pitch?: number;
}

export function TextToSpeech({ 
  text, 
  className = '', 
  lang = 'en-US', 
  rate = 1, 
  pitch = 1 
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check speech synthesis support on component mount
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      console.warn('Text-to-speech not supported in this browser');
    }
  }, []);

  const speak = () => {
    // If speech synthesis is not supported
    if (!isSupported) return;

    // Stop any ongoing speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure utterance
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Event listeners to manage speaking state
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button 
      onClick={speak} 
      className={`
        p-2 rounded-full transition-all duration-300 ease-in-out
        ${isSpeaking 
          ? 'bg-primary/20 scale-110 animate-pulse shadow-lg' 
          : 'hover:bg-primary/10 hover:scale-105'}
        ${className}
      `}
      aria-label="Text to Speech"
    >
      <Volume2 
        className={`
          w-6 h-6 
          ${isSpeaking ? 'text-primary' : 'text-muted-foreground'}
        `} 
      />
    </button>
  );
}

// Higher-Order Component for adding text-to-speech to pages
export function withTextToSpeech<P extends object>(
  WrappedComponent: React.ComponentType<P>, 
  getPageDescription: (props: P) => string
) {
  return function TextToSpeechWrapper(props: P) {
    const pageDescription = getPageDescription(props);

    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <TextToSpeech text={pageDescription} />
        </div>
        <WrappedComponent {...props} />
      </div>
    );
  };
}
