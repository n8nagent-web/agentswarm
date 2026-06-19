import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { RetellWebClient } from "retell-client-js-sdk";
import { createRetellWebCall } from "@/lib/retell";

export interface VoiceTrigger {
  id: number;
  name: string;
  serviceName: string;
  phoneNumber: string;
  email: string;
}

interface VoiceWidgetProps {
  voiceTrigger?: VoiceTrigger | null;
  onAgentEnd?: () => void;
  assistantId?: string;
  leadMode?: boolean;
}

const defaultAgentId = import.meta.env.VITE_RETELL_AGENT_ID || "";

const VoiceWidget = ({
  voiceTrigger,
  onAgentEnd,
  assistantId = defaultAgentId,
  leadMode = false,
}: VoiceWidgetProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retellRef = useRef<RetellWebClient | null>(null);
  const activeCallRef = useRef(false);
  const startingCallRef = useRef(false);
  const lastVoiceTriggerIdRef = useRef<number | null>(null);
  const onAgentEndRef = useRef(onAgentEnd);

  onAgentEndRef.current = onAgentEnd;

  const handleCallEnded = useCallback(() => {
    activeCallRef.current = false;
    startingCallRef.current = false;
    setIsStarting(false);
    setIsListening(false);
    setIsSpeaking(false);
    onAgentEndRef.current?.();
  }, []);

  useEffect(() => {
    const client = new RetellWebClient();
    retellRef.current = client;

    client.on("call_started", () => {
      activeCallRef.current = true;
      startingCallRef.current = false;
      setIsStarting(false);
      setIsListening(true);
      setIsSpeaking(false);
      setError(null);
    });

    client.on("call_ended", handleCallEnded);

    client.on("agent_start_talking", () => {
      setIsSpeaking(true);
      setIsListening(false);
    });

    client.on("agent_stop_talking", () => {
      setIsSpeaking(false);
      if (activeCallRef.current) {
        setIsListening(true);
      }
    });

    client.on("error", (message: string) => {
      console.error("Retell error:", message);
      setError(typeof message === "string" ? message : "Voice call failed");
      handleCallEnded();
    });

    return () => {
      client.stopCall();
      retellRef.current = null;
      activeCallRef.current = false;
      startingCallRef.current = false;
    };
  }, [handleCallEnded]);

  const startVoiceAgent = useCallback(async (leadData?: VoiceTrigger) => {
    if (!retellRef.current || activeCallRef.current || startingCallRef.current) return;

    if (!assistantId) {
      setError("Retell agent ID is not configured. Set VITE_RETELL_AGENT_ID in your .env file.");
      return;
    }

    startingCallRef.current = true;
    setIsStarting(true);

    try {
      setError(null);

      const isLeadCall = Boolean(leadData);
      const dynamicVariables: Record<string, string> = {
        form: isLeadCall ? "true" : "false",
      };

      if (leadData) {
        dynamicVariables.customer_name = leadData.name;
        dynamicVariables.service_name = leadData.serviceName;
        dynamicVariables.phone_number = leadData.phoneNumber;
        dynamicVariables.email = leadData.email;
        dynamicVariables.lead_name = leadData.name;
      }

      const beginMessage = leadData
        ? `Hi ${leadData.name}, you asked for ${leadData.serviceName}. How can I help you today?`
        : undefined;

      const { access_token } = await createRetellWebCall(assistantId, {
        dynamicVariables,
        beginMessage,
      });

      if (!retellRef.current || !startingCallRef.current) return;

      // startCall already attaches agent audio — do NOT call startAudioPlayback()
      // or the same voice plays twice (echo/double audio).
      await retellRef.current.startCall({ accessToken: access_token });
    } catch (err) {
      console.error("Failed to start Retell voice call:", err);
      setError(err instanceof Error ? err.message : "Failed to start voice call");
      handleCallEnded();
    }
  }, [assistantId, handleCallEnded]);

  useEffect(() => {
    if (!voiceTrigger?.id || lastVoiceTriggerIdRef.current === voiceTrigger.id) return;

    lastVoiceTriggerIdRef.current = voiceTrigger.id;
    startVoiceAgent(voiceTrigger);
  }, [voiceTrigger, startVoiceAgent]);

  const toggleListening = () => {
    if (isListening && retellRef.current) {
      retellRef.current.stopCall();
      return;
    }

    startVoiceAgent();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {(isListening || isSpeaking) && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-primary/40 animate-pulse"></div>
          </>
        )}

        <div
          className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? "bg-destructive shadow-lg shadow-destructive/50"
              : isSpeaking
              ? "bg-primary shadow-lg shadow-primary/50"
              : "bg-muted hover:bg-muted/80"
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
              ? "Listening to you..."
              : isSpeaking
              ? "AI is speaking..."
              : "Ready to Talk"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isListening
              ? "Speak now, I'm listening"
              : isSpeaking
              ? "Please wait while I respond"
              : leadMode
              ? "Submit the form to start a personalized voice call"
              : "Click the button below to start a voice conversation"}
          </p>
          {error && (
            <p className="text-sm text-destructive max-w-xs mx-auto">{error}</p>
          )}
        </div>

        {!leadMode && (
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "default"}
            disabled={isSpeaking || isStarting}
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
        )}

        {voiceTrigger && (isListening || isSpeaking) && (
          <Button
            onClick={toggleListening}
            variant="destructive"
            size="lg"
            className="w-full max-w-xs"
          >
            <MicOff className="w-5 h-5 mr-2" />
            End Conversation
          </Button>
        )}
      </div>
    </div>
  );
};

export default VoiceWidget;
