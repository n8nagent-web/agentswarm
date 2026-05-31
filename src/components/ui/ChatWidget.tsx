import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot } from "lucide-react";
import { getOrCreateChatId } from "@/lib/chatSession";

const stripHtml = (html: string) => {
  if (!html) return '';

  let decoded = html;
  const txt = document.createElement("textarea");

  for (let i = 0; i < 3; i++) {
    txt.innerHTML = decoded;
    const newDecoded = txt.value;
    if (newDecoded === decoded) break;
    decoded = newDecoded;
  }

  decoded = decoded.replace(/<[^>]*>/g, '');

  const tmp = document.createElement("DIV");
  tmp.innerHTML = decoded;

  const cleanText = (tmp.textContent || tmp.innerText || decoded).trim();

  return cleanText.replace(/\s+/g, ' ');
};

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface MessageTrigger {
  id: number;
  text: string;
}

interface ChatWidgetProps {
  customMessage?: string;
  messageTrigger?: MessageTrigger | null;
  apiEndpoint?: string;
  showOnlyAgentMessages?: boolean;
  requireActivation?: boolean;
  hideInput?: boolean;
}

const ChatWidget = ({
  customMessage,
  messageTrigger,
  apiEndpoint = '/api/chatbot',
  showOnlyAgentMessages = false,
  requireActivation = false,
  hideInput = false,
}: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isActive, setIsActive] = useState(!requireActivation);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatId = useMemo(() => getOrCreateChatId(apiEndpoint), [apiEndpoint]);

  const getApiUrl = (endpoint: string) => {
    const inboundUrl =
      import.meta.env.VITE_INBOUND_CHATBOT_URL ||
      'https://demoprojects.app.n8n.cloud/webhook-test/inbound-chatbot';

    if (import.meta.env.PROD) {
      if (endpoint === '/api/inbound-chatbot') {
        return inboundUrl;
      }
      if (endpoint === '/api/outbound-chatbot') {
        return 'https://n8n.srv1011048.hstgr.cloud/webhook/outboundchatbot';
      }
    }
    return endpoint;
  };

  const extractReply = (data: unknown): string => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (Array.isArray(data) && data.length > 0) return extractReply(data[0]);
    if (typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      for (const key of ['output', 'message', 'reply', 'text', 'response', 'result', 'chatOutput', 'answer']) {
        if (typeof obj[key] === 'string' && obj[key]) return obj[key] as string;
      }
      if (obj.data) return extractReply(obj.data);
      if (obj.body) return extractReply(obj.body);
    }
    return '';
  };

  const parseErrorMessage = async (response: Response): Promise<string> => {
    const errorBody = await response.text().catch(() => '');
    try {
      const parsed = JSON.parse(errorBody) as { message?: string; hint?: string };
      const parts = [parsed.message, parsed.hint].filter(Boolean);
      if (parts.length > 0) return parts.join(' — ');
    } catch {
      // fall through
    }
    return errorBody || `HTTP ${response.status} ${response.statusText}`;
  };

  const fetchBotReply = useCallback(async (messageText: string): Promise<string> => {
    const response = await fetch(getApiUrl(apiEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageText,
        chatInput: messageText,
        text: messageText,
        chatId,
        sessionId: chatId,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    let outputText = '';

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    if (contentType.includes('application/json')) {
      try {
        const data = await response.json();
        outputText = extractReply(data);
      } catch {
        outputText = '';
      }
    } else {
      outputText = await response.text().catch(() => '');
    }

    if (!outputText || !outputText.trim()) {
      throw new Error('n8n returned an empty response. Check that your workflow sends back output, message, reply, or text.');
    }

    return stripHtml(outputText);
  }, [apiEndpoint, chatId]);

  const sendExternalMessage = useCallback(async (messageText: string, userMessageId: number) => {
    setIsActive(true);
    setMessages(prev => [...prev, { id: userMessageId, text: messageText, isUser: true }]);
    setIsLoading(true);

    try {
      const outputText = await fetchBotReply(messageText);
      setMessages(prev => [...prev, { id: userMessageId + 1, text: outputText, isUser: false }]);
    } catch (error) {
      console.error('Auto-chat API error:', error);
      const errorText =
        error instanceof Error
          ? error.message
          : "Sorry, I'm having trouble connecting. Please try again.";
      setMessages(prev => [
        ...prev,
        { id: userMessageId + 1, text: errorText, isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBotReply]);

  useEffect(() => {
    if (!messageTrigger?.id || !messageTrigger.text.trim()) return;
    sendExternalMessage(messageTrigger.text, messageTrigger.id);
  }, [messageTrigger?.id, messageTrigger?.text, sendExternalMessage]);

  useEffect(() => {
    if (!customMessage?.trim()) return;

    const timeoutId = setTimeout(() => {
      sendExternalMessage(customMessage, Date.now());
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [customMessage, sendExternalMessage]);

  const handleSend = async () => {
    if (!isActive || isLoading) return;
    if (inputValue.trim()) {
      const userMessageId = Date.now();
      const messageText = inputValue;
      setInputValue("");
      await sendExternalMessage(messageText, userMessageId);
    }
  };

  const visibleMessages = showOnlyAgentMessages ? messages.filter((m) => !m.isUser) : messages;

  return (
    <div className="bg-background border border-border rounded-xl p-4 max-w-md w-full">
      <div className="h-80 overflow-y-auto mb-4 space-y-3">
        {visibleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="bg-primary rounded-full p-1">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {message.text}
            </div>
            {message.isUser && (
              <div className="bg-secondary rounded-full p-1">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 justify-start">
            <div className="bg-primary rounded-full p-1">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="max-w-xs p-3 rounded-lg bg-muted text-muted-foreground">
              Typing...
            </div>
          </div>
        )}
      </div>
      {!hideInput && (
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isActive ? "Type your message..." : "Fill the form to start chatting..."}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!isActive || isLoading}
            aria-disabled={!isActive || isLoading}
          />
          <Button onClick={handleSend} size="icon" disabled={!isActive || isLoading} aria-disabled={!isActive || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
