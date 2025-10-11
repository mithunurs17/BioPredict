import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MessageCircleIcon, SendIcon, XIcon, LoaderIcon, Mic, Upload, Volume2, VolumeX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { TextToSpeech } from '@/components/text-to-speech';

// Helper function to read file as base64
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  // Add optional file property for attachments
  file?: {
    name: string;
    type: string;
    url: string;
  };
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your health assistant. Ask me any questions about diet, exercise, or lifestyle changes to improve your health."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  
  // Speech recognition setup
  const recognitionRef = useRef<any | null>(null);

  // Initialize speech recognition and voice synthesis
  useEffect(() => {
    // Speech recognition initialization
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      // Continue with the rest of initialization
    } else {
      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          // Auto-send after voice input
          setTimeout(() => {
            handleSendMessage(undefined, transcript);
          }, 500);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          toast({
            variant: "destructive",
            title: "Voice Input Error",
            description: "There was a problem with voice recognition. Please try again or type your message.",
          });
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    // Initialize speech synthesis voices
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      console.log('Speech synthesis initialized');
      
      // Pre-load voices
      const loadVoices = () => {
        const voices = speechSynthesisRef.current?.getVoices() || [];
        console.log('Available voices:', voices.length);
        if (voices.length === 0) {
          console.warn('No voices available');
        }
      };
      
      // Some browsers need this event to load voices
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.onvoiceschanged = loadVoices;
      }
      
      // Try to load voices immediately as well
      loadVoices();
    } else {
      console.warn('Speech synthesis not supported in this browser');
      setVoiceEnabled(false); // Disable voice if not available
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      // Remove event listener and cancel any ongoing speech
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        speechSynthesisRef.current.onvoiceschanged = null;
      }
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      // Greet user with voice when chatbox opens
      if (voiceEnabled) {
        const greeting = "Hello! I'm your health assistant. How can I help you today?";
        speakText(greeting);
      }
    }
  }, [isOpen]);

  // Function to handle voice input
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          toast({
            title: "Listening...",
            description: "Speak now. Your voice will be converted to text.",
          });
        } catch (error) {
          console.error('Speech recognition error:', error);
        }
      }
    }
  };

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Show file name in input
      setInputValue(`Attached file: ${file.name}`);
      
      toast({
        title: "File Attached",
        description: `${file.name} has been attached. Add a message and send.`,
      });
    }
  };

  // Function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Function to clean text of markdown formatting
  const cleanTextForSpeech = (text: string) => {
    // Remove markdown formatting like **bold**, *italic*, etc.
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold (**text**)
      .replace(/\*(.+?)\*/g, '$1')      // Remove italic (*text*)
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Replace links [text](url) with just text
      .replace(/#+\s(.+)/g, '$1')      // Remove heading markers (# Heading)
      .replace(/`(.+?)`/g, '$1')       // Remove code ticks
      .replace(/\n\s*[-*+]\s/g, '. ')   // Replace list items with periods
      .replace(/\n\n/g, '. ')          // Replace double line breaks with period + space
      .replace(/\n/g, ' ')             // Replace single line breaks with space
      .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
      .trim();                         // Trim whitespace
  };

  // Function to speak text using the Web Speech API
  const speakText = (text: string) => {
    // First check if voice is enabled and speech synthesis is available
    if (!voiceEnabled) {
      console.log('Voice is disabled');
      return;
    }
    
    if (!speechSynthesisRef.current || !('speechSynthesis' in window)) {
      console.error('Speech synthesis not available');
      toast({
        variant: "destructive",
        title: "Voice Error",
        description: "Text-to-speech is not available in your browser.",
      });
      setVoiceEnabled(false); // Disable voice if not available
      return;
    }
    
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    // Clean the text of markdown formatting
    const cleanedText = cleanTextForSpeech(text);
    console.log('Cleaned text for speech:', cleanedText);
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Voice settings
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    // Add event handlers to track utterance status
    utterance.onstart = () => console.log('Speech started');
    utterance.onend = () => console.log('Speech ended');
    utterance.onerror = (event) => {
      console.error('Speech synthesis utterance error:', event);
      // Don't show toast for interruptions to avoid annoying the user
      if (event.error !== 'interrupted') {
        toast({
          variant: "destructive",
          title: "Voice Error",
          description: `Speech error: ${event.error}`,
        });
      }
    };
    
    // Load voices and ensure they're available
    let voices = speechSynthesisRef.current.getVoices();
    console.log(`Initial voices: ${voices.length}`);
    
    // If voices array is empty, wait for voices to load
    if (voices.length === 0) {
      console.log('No voices available, waiting for voices to load...');
      // Force voices to load
      speechSynthesisRef.current.onvoiceschanged = () => {
        voices = speechSynthesisRef.current?.getVoices() || [];
        console.log(`Loaded ${voices.length} voices`);
        
        if (voices.length > 0) {
          // Try to find a male voice
          const selectedVoice = voices.find(voice => 
            voice.name.includes('Male') && 
            voice.lang.startsWith('en')
          ) || voices.find(voice => 
            voice.lang.startsWith('en')
          ) || voices[0];
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log(`Selected voice: ${selectedVoice.name}`);
          } else {
            console.warn('No suitable voice found, using default');
          }
          
          try {
            // Use a timeout to ensure the browser is ready
            setTimeout(() => {
              if (speechSynthesisRef.current) {
                speechSynthesisRef.current.speak(utterance);
                console.log('Speaking started after voice load');
              }
            }, 100);
          } catch (error) {
            console.error('Speech synthesis error:', error);
            toast({
              variant: "destructive",
              title: "Voice Error",
              description: "There was a problem with text-to-speech. Please try again.",
            });
          }
        } else {
          console.error('No voices available after loading');
          toast({
            variant: "destructive",
            title: "Voice Error",
            description: "No voices available for text-to-speech.",
          });
        }
      };
      
      // Trigger voice loading
      speechSynthesisRef.current.getVoices();
    } else {
      // Voices already loaded
      console.log(`Using ${voices.length} available voices`);
      
      // Log all available voices for debugging
      voices.forEach((voice, index) => {
        console.log(`Voice ${index}: ${voice.name} (${voice.lang})`);
      });
      
      const selectedVoice = voices.find(voice => 
        voice.name.includes('Male') && 
        voice.lang.startsWith('en')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Selected voice: ${selectedVoice.name}`);
      } else {
        console.warn('No suitable voice found, using default');
      }
      
      try {
        // Use a timeout to ensure the browser is ready
        setTimeout(() => {
          if (speechSynthesisRef.current) {
            speechSynthesisRef.current.speak(utterance);
            console.log('Speaking started with timeout');
          }
        }, 100);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        
        // Try to reinitialize speech synthesis
        if ('speechSynthesis' in window) {
          speechSynthesisRef.current = window.speechSynthesis;
          try {
            setTimeout(() => {
              if (speechSynthesisRef.current) {
                speechSynthesisRef.current.speak(utterance);
                console.log('Speaking started after reinitialization');
              }
            }, 100);
          } catch (fallbackError) {
            console.error('Fallback speech synthesis failed:', fallbackError);
            toast({
              variant: "destructive",
              title: "Voice Error",
              description: "There was a problem with text-to-speech. Please try again.",
            });
          }
        }
      }
    }
  };

  // Function to toggle voice
  const toggleVoice = () => {
    setVoiceEnabled(prev => {
      const newState = !prev;
      console.log('Voice enabled:', newState);
      
      // If turning off voice, stop any ongoing speech
      if (!newState && speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        console.log('Cancelled ongoing speech');
        
        // Show toast notification when voice is disabled
        toast({
          title: "Voice Disabled",
          description: "Text-to-speech has been turned off.",
        });
      }
      
      // If turning on voice, check if speech synthesis is available
      if (newState) {
        if (!speechSynthesisRef.current || !('speechSynthesis' in window)) {
          console.error('Speech synthesis not available');
          toast({
            variant: "destructive",
            title: "Voice Error",
            description: "Text-to-speech is not available in your browser.",
          });
          return false; // Keep voice disabled if not available
        }
        
        // Initialize speech synthesis if needed
        if (!speechSynthesisRef.current) {
          speechSynthesisRef.current = window.speechSynthesis;
        }
        
        // Load voices if not already loaded
        const voices = speechSynthesisRef.current.getVoices();
        if (voices.length === 0) {
          // Force voices to load
          speechSynthesisRef.current.onvoiceschanged = () => {
            const loadedVoices = speechSynthesisRef.current?.getVoices() || [];
            console.log(`Loaded ${loadedVoices.length} voices`);
          };
          speechSynthesisRef.current.getVoices();
        }
        
        // Show toast notification when voice is enabled
        toast({
          title: "Voice Enabled",
          description: "Text-to-speech has been turned on.",
        });
      }
      
      return newState;
    });
  };

  const handleSendMessage = async (e?: React.FormEvent, transcript?: string) => {
    if (e) {
      e.preventDefault();
    }
    
    const messageText = transcript || inputValue;
    if (!messageText.trim() && !uploadedFile) {
      return;
    }
    
    // Cancel any ongoing speech before sending a new message
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    
    const userMessage = {
      role: 'user' as const,
      content: messageText,
      file: uploadedFile ? {
        name: uploadedFile.name,
        type: uploadedFile.type,
        url: URL.createObjectURL(uploadedFile)
      } : undefined
    };
    
    // Update messages state with user message
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);
    
    try {
      // Create a copy of the messages array with the new user message
      const updatedMessages = [
        ...messages,
        userMessage
      ];
      
      // Prepare the messages for the API call with system message
      const messagesToSend = [
        {
          role: 'system',
          content: 'You are a helpful medical assistant. IMPORTANT: Format your responses using clean numbered lists (1. 2. 3.) and bullet points without asterisks (*). Never use asterisks (*) in your responses. Use proper spacing between sections. Make your responses look professional and aesthetic. Keep responses concise and informative.'
        },
        ...updatedMessages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }))
      ];
      
      // If there's an uploaded file, add it to the last message
      if (uploadedFile) {
        const fileContent = await readFileAsBase64(uploadedFile);
        
        // Add the file content to the last message
        if (messagesToSend.length > 0) {
          const lastMessage = messagesToSend[messagesToSend.length - 1];
          lastMessage.content += `

Attached file: ${uploadedFile.name}`;
          // You would need to handle the file content appropriately here
          // This is just a placeholder
        }
      }
      
      // Call our server's chat endpoint instead of OpenRouter directly
      console.log('Sending request to /api/ai/chat with messages:', messagesToSend);
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend
        }),
      });
      
      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          // If we can't parse the error response as JSON, use the status text
          console.error('Could not parse error response as JSON:', jsonError);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        throw new Error('Server returned invalid response format');
      }

      let responseText = data.response;
      
      // Post-process the response to remove asterisks and improve formatting
      responseText = responseText
        .replace(/\*\s*/g, '') // Remove asterisks and spaces after them
        .replace(/^\s*[\*\-]\s*/gm, '• ') // Convert remaining bullet points to clean bullets
        .replace(/\n\s*\n/g, '\n\n') // Clean up extra line breaks
        .trim();
      
      console.log('Final response text:', responseText);
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: responseText
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if voice is enabled
      // This is now after the entire message has been processed
      if (voiceEnabled) {
        // Small delay to ensure UI updates first
        setTimeout(() => {
          speakText(responseText);
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error toast with more specific message
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 md:right-8 z-50 w-[90vw] max-w-[500px] shadow-xl"
          >
            <Card className="border-2 border-[#70a1ff]/30 hover:border-[#70a1ff]/70 transition-all duration-300 group backdrop-blur-md bg-black/40 shadow-[0_0_15px_rgba(106,90,205,0.3)]">
              <CardHeader className="bg-gradient-to-r from-[#1e3a8a] via-[#3b5dc9] to-[#1e3a8a] pb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#70a1ff]/10 via-[#70a1ff]/20 to-[#70a1ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExZmYiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="flex justify-between items-center relative z-10">
                  <CardTitle className="text-lg flex items-center gap-2 text-white group-hover:text-white transition-colors">
                    <MessageCircleIcon size={18} className="text-white group-hover:text-white transition-colors filter drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]" />
                    <span className="filter drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]">Health Assistant</span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleVoice}
                      className={`text-white hover:text-white hover:bg-white/20 transition-colors ${voiceEnabled ? 'bg-white/10' : ''}`}
                      title={voiceEnabled ? "Disable voice" : "Enable voice"}
                    >
                      {voiceEnabled ? (
                        <Volume2 size={18} className="filter drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
                      ) : (
                        <VolumeX size={18} className="filter drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:text-white hover:bg-white/20 transition-colors">
                      <XIcon size={18} className="filter drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-gradient-to-b from-[#1e3a8a]/80 to-[#070d1f]/80">
                <ScrollArea className="h-[450px] p-4">
                  <div className="flex flex-col gap-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`p-3 rounded-lg max-w-[85%] transition-all duration-300 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-[#70a1ff]/90 via-[#7d88e6]/90 to-[#8a70ff]/90 text-white backdrop-blur-sm hover:shadow-[0_0_15px_rgba(112,161,255,0.5)] hover:scale-[1.02]'
                              : 'bg-gradient-to-r from-[#1e3a8a]/70 via-[#3b5dc9]/70 to-[#1e3a8a]/70 text-white/90 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(59,93,201,0.3)] hover:scale-[1.02] border border-[#70a1ff]/30'
                          }`}
                        >
                          {/* Format message content with proper line breaks and spacing */}
                          <div className="whitespace-pre-line">
                            {message.content}
                          </div>
                          
                          {/* Display file attachment if present */}
                          {message.file && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                              <a 
                                href={message.file.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition-colors"
                              >
                                <Upload size={14} />
                                {message.file.name}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="p-3 rounded-lg max-w-[85%] bg-gradient-to-r from-[#1e3a8a]/70 via-[#3b5dc9]/70 to-[#1e3a8a]/70 flex items-center gap-2 border border-[#70a1ff]/30 shadow-[0_0_10px_rgba(112,161,255,0.2)]">
                          <LoaderIcon size={16} className="animate-spin text-white" />
                          <span className="text-white filter drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]">Thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t border-[#70a1ff]/30 bg-gradient-to-b from-[#1e3a8a]/90 to-[#070d1f]/90">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about diet, exercise, or lifestyle changes..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-[#70a1ff]/50 bg-black/30 border-[#70a1ff]/30 text-white placeholder:text-white/50 focus:border-[#70a1ff]/70 backdrop-blur-md"
                    disabled={isLoading}
                  />
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  {/* File upload button */}
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={triggerFileUpload}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#3b5dc9] to-[#1e3a8a] text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(112,161,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload file"
                  >
                    <Upload size={16} />
                  </Button>
                  
                  {/* Voice input button */}
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(112,161,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gradient-to-r from-[#3b5dc9] to-[#1e3a8a] text-white'}`}
                    title="Voice input"
                  >
                    <Mic size={16} />
                  </Button>
                  
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={(!inputValue.trim() && !uploadedFile) || isLoading}
                    className="bg-gradient-to-r from-[#70a1ff] via-[#7d88e6] to-[#8a70ff] text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(112,161,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendIcon size={16} />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 right-4 md:right-8 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-[0_0_20px_rgba(112,161,255,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(112,161,255,0.6)] group relative bg-gradient-to-r from-[#70a1ff] via-[#7d88e6] to-[#8a70ff]"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#70a1ff]/20 via-[#7d88e6]/20 to-[#8a70ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <MessageCircleIcon className="transition-transform duration-300 group-hover:rotate-12 relative z-10 text-white" />
          <span className="absolute inset-0 rounded-full animate-ping bg-[#70a1ff]/40 opacity-0 group-hover:opacity-100"></span>
        </Button>
      </motion.div>
    </>
  );
}

// Add TypeScript interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}