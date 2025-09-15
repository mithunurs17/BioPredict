import { useState, useEffect } from 'react';
import { Volume2, Pause, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TextToSpeechProps {
  text: string;
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [neonPulse, setNeonPulse] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Create a pulsing neon effect while speaking and on hover
  useEffect(() => {
    if (!isSpeaking && !isHovered) return;
    
    const intervalId = setInterval(() => {
      setNeonPulse(prev => !prev);
    }, 600);
    
    return () => {
      clearInterval(intervalId);
      setNeonPulse(false);
    };
  }, [isSpeaking, isHovered]);

  // Initialize voices and wait for them to load
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      };

      // Load voices immediately
      loadVoices();
      
      // Some browsers need this event to load voices
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);
  
  const speak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a single utterance for the entire text
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a female voice
      const selectedVoice = voices.find(voice => 
        voice.name.includes('Female') && 
        voice.lang.startsWith('en')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Handle completion
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      // Handle errors
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      // Ensure speech continues
      const checkSpeaking = setInterval(() => {
        if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 100);
      
      // Clear interval when speech ends
      utterance.onend = () => {
        clearInterval(checkSpeaking);
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
    ${isSpeaking || isHovered
      ? 'bg-opacity-20 transition-all duration-300 transform hover:scale-110' 
      : 'bg-primary bg-opacity-10 hover:bg-opacity-20 transition-all duration-200'
    }
  `;
  
  // Generate styles for the speaking button with glow effect
  const buttonStyle = (isSpeaking || isHovered) ? {
    background: neonPulse ? 'rgba(170, 0, 255, 0.2)' : 'rgba(0, 170, 255, 0.2)',
    boxShadow: neonPulse 
      ? `0 0 5px ${neonColors.magenta}, 0 0 10px ${neonColors.magenta}` 
      : `0 0 5px ${neonColors.cyan}, 0 0 10px ${neonColors.cyan}`,
    borderColor: neonPulse ? neonColors.magenta : neonColors.cyan,
    borderWidth: '1px',
    borderStyle: 'solid'
  } : {};
  
  // Generate icon class based on speaking state
  const iconClass = `w-4 h-4 ${isSpeaking || isHovered
    ? (neonPulse ? 'text-[#ff00ff]' : 'text-[#00ffff]') 
    : 'text-primary'
  }`;
  
  return (
    <button
      onClick={speak}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      
      {/* Animation waves when speaking or hovered */}
      {(isSpeaking || isHovered) && (
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