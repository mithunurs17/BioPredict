import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VolumeIcon, Volume2Icon, PauseIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TextToSpeechProps {
  text: string;
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const synth = window.speechSynthesis;
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Try to set a friendly voice
    let voices = synth.getVoices();
    if (voices.length === 0) {
      // Voice list isn't loaded yet, wait for it
      window.speechSynthesis.onvoiceschanged = () => {
        voices = synth.getVoices();
        const englishVoice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female'));
        if (englishVoice) newUtterance.voice = englishVoice;
      };
    } else {
      const englishVoice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female'));
      if (englishVoice) newUtterance.voice = englishVoice;
    }
    
    // Set properties for better sound
    newUtterance.rate = 1; // Normal speed
    newUtterance.pitch = 1; // Normal pitch
    
    // Handle speech end event
    newUtterance.onend = () => {
      setSpeaking(false);
    };
    
    setUtterance(newUtterance);
    
    // Clean up
    return () => {
      if (speaking) {
        synth.cancel();
      }
    };
  }, [text]);

  const toggleSpeech = () => {
    if (!supported) {
      toast({
        variant: "destructive",
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
      });
      return;
    }

    const synth = window.speechSynthesis;
    
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
    } else {
      if (utterance) {
        synth.speak(utterance);
        setSpeaking(true);
      }
    }
  };

  if (!supported) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2 opacity-50 cursor-not-allowed"
        disabled
      >
        <VolumeIcon size={16} />
        <span className="hidden md:inline">Read Aloud</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
      onClick={toggleSpeech}
    >
      {speaking ? (
        <>
          <PauseIcon size={16} />
          <span className="hidden md:inline">Stop Reading</span>
        </>
      ) : (
        <>
          <Volume2Icon size={16} />
          <span className="hidden md:inline">Read Aloud</span>
        </>
      )}
    </Button>
  );
}