import { useState, useEffect } from 'react';
import { Volume2, Pause } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [neonPulse, setNeonPulse] = useState(false);
  
  // Create a pulsing neon effect while speaking
  useEffect(() => {
    if (!isSpeaking) return;
    
    // Set up the interval to toggle the neon effect for pulsing
    const intervalId = setInterval(() => {
      setNeonPulse(prev => !prev);
    }, 600);
    
    return () => {
      clearInterval(intervalId);
      setNeonPulse(false);
    };
  }, [isSpeaking]);
  
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
  
  // Add neon colors based on speaking state
  const neonColors = {
    magenta: '#ff00ff',
    cyan: '#00ffff',
    purple: '#aa00ff',
    blue: '#00aaff'
  };
  
  // Generate the button class based on speaking state
  const buttonClass = `
    relative flex items-center justify-center rounded-full w-8 h-8 
    ${isSpeaking 
      ? 'bg-opacity-20 transition-all duration-300 transform hover:scale-110' 
      : 'bg-primary bg-opacity-10 hover:bg-opacity-20 transition-all duration-200'
    }
  `;
  
  // Generate styles for the speaking button with glow effect
  const buttonStyle = isSpeaking ? {
    background: neonPulse ? 'rgba(170, 0, 255, 0.2)' : 'rgba(0, 170, 255, 0.2)',
    boxShadow: neonPulse 
      ? `0 0 5px ${neonColors.magenta}, 0 0 10px ${neonColors.magenta}` 
      : `0 0 5px ${neonColors.cyan}, 0 0 10px ${neonColors.cyan}`,
    borderColor: neonPulse ? neonColors.magenta : neonColors.cyan,
    borderWidth: '1px',
    borderStyle: 'solid'
  } : {};
  
  // Generate icon class based on speaking state
  const iconClass = `w-4 h-4 ${isSpeaking 
    ? (neonPulse ? 'text-[#ff00ff]' : 'text-[#00ffff]') 
    : 'text-primary'
  }`;
  
  return (
    <button
      onClick={speak}
      className={buttonClass}
      style={buttonStyle}
      aria-label={isSpeaking ? "Stop Text to Speech" : "Listen to Text"}
      title={isSpeaking ? "Stop Text to Speech" : "Listen to Text"}
    >
      {isSpeaking ? (
        <Pause className={iconClass} />
      ) : (
        <Volume2 className={iconClass} />
      )}
      
      {/* Animation waves when speaking */}
      {isSpeaking && (
        <>
          <span className={`
            absolute inset-0 rounded-full animate-ping opacity-30 
            ${neonPulse ? 'bg-[#ff00ff]' : 'bg-[#00ffff]'} 
            pointer-events-none
          `}></span>
          {/* Additional outer glow for more vibrant effect */}
          <span className={`
            absolute inset-[-3px] rounded-full opacity-20
            ${neonPulse ? 'bg-[#ff00ff]' : 'bg-[#00ffff]'} 
            pointer-events-none blur-[2px]
          `}></span>
        </>
      )}
    </button>
  );
}