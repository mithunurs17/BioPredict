import { useState } from 'react';
import { Volume2, Pause } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const speak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Setting a balanced speed
      utterance.rate = 0.9;
      
      // Try to get a pleasant voice - ideally a female voice for medical content
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Google UK English Female')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Handle completion
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      // Handle errors
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <button
      onClick={speak}
      className="relative flex items-center justify-center rounded-full w-8 h-8 bg-primary bg-opacity-10 hover:bg-opacity-20 transition-all duration-200"
      aria-label={isSpeaking ? "Stop Text to Speech" : "Listen to Text"}
      title={isSpeaking ? "Stop Text to Speech" : "Listen to Text"}
    >
      {isSpeaking ? (
        <Pause className="w-4 h-4 text-primary" />
      ) : (
        <Volume2 className="w-4 h-4 text-primary" />
      )}
      
      {/* Animation waves when speaking */}
      {isSpeaking && (
        <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-primary pointer-events-none"></span>
      )}
    </button>
  );
}