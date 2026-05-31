import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import Vapi from "@vapi-ai/web";

interface VoiceWidgetProps {
  triggerAgent?: boolean;
  onAgentEnd?: () => void;
  assistantId?: string;
  formData?: {
    name: string;
    serviceName: string;
    phoneNumber: string;
    email: string;
  };
}

const VoiceWidget = ({ triggerAgent, onAgentEnd, assistantId = "16d5985e-864a-4966-88fb-3e6d7f1834fa", formData }: VoiceWidgetProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    // Initialize Vapi
    vapiRef.current = new Vapi("ba188daf-c05b-46f2-abac-edda7af8bc64");
    
    vapiRef.current.on("call-start", () => {
      setIsListening(true);
      setIsSpeaking(false);
    });
    
    vapiRef.current.on("call-end", () => {
      setIsListening(false);
      setIsSpeaking(false);
      onAgentEnd?.();
    });
    
    vapiRef.current.on("speech-start", () => {
      setIsListening(false);
      setIsSpeaking(true);
    });
    
    vapiRef.current.on("speech-end", () => {
      setIsSpeaking(false);
      setIsListening(true);
    });

    return () => {
      vapiRef.current?.stop();
    };
  }, [onAgentEnd]);

  useEffect(() => {
    if (triggerAgent && vapiRef.current) {
      startVoiceAgent();
    }
  }, [triggerAgent]);

  const startVoiceAgent = async () => {
    if (vapiRef.current) {
      try {
        // If form data is provided, start with context
        if (formData) {
          await vapiRef.current.start(assistantId, {
            variableValues: {
              leadName: formData.name,
              serviceName: formData.serviceName,
              phoneNumber: formData.phoneNumber,
              email: formData.email,
            },
            firstMessage: `Hello ${formData.name}, I understand you're interested in ${formData.serviceName}. How can I help you today?`,
          });
        } else {
          await vapiRef.current.start(assistantId);
        }
      } catch (error) {
        console.error("Failed to start voice agent:", error);
        setIsListening(false);
        setIsSpeaking(false);
      }
    }
  };

  const toggleListening = () => {
    if (isListening && vapiRef.current) {
      vapiRef.current.stop();
    } else {
      startVoiceAgent();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* Animated rings */}
        {(isListening || isSpeaking) && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-primary/40 animate-pulse"></div>
          </>
        )}
        
        {/* Main sphere */}
        <div 
          className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-destructive shadow-lg shadow-destructive/50' 
              : isSpeaking
              ? 'bg-primary shadow-lg shadow-primary/50'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {isListening ? (
            <Mic className="w-8 h-8 text-white" />
          ) : isSpeaking ? (
            <Volume2 className="w-8 h-8 text-white animate-pulse" />
          ) : (
            <Mic className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isListening 
              ? 'Listening to you...' 
              : isSpeaking 
              ? 'AI is speaking...' 
              : 'Ready to Talk'
            }
          </h3>
          <p className="text-sm text-muted-foreground">
            {isListening 
              ? 'Speak now, I\'m listening' 
              : isSpeaking 
              ? 'Please wait while I respond' 
              : 'Click the button below to start a voice conversation'
            }
          </p>
        </div>
        
        <Button 
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          disabled={isSpeaking}
          size="lg"
          className="w-full max-w-xs"
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              End Conversation
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Voice Chat
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VoiceWidget;