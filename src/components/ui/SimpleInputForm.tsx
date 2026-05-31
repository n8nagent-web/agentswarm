import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface SimpleInputFormProps {
  onSend?: (message: string) => void;
}

const SimpleInputForm = ({ onSend }: SimpleInputFormProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed) {
      onSend?.(trimmed);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Send</h3>
      <Textarea
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message directly here..."
        className="mb-4 bg-background text-foreground border-border"
      />
      <Button
        onClick={handleSend}
        className="w-full"
        disabled={!message.trim()}
      >
        <Send className="w-4 h-4 mr-2" />
        Send
      </Button>
    </div>
  );
};

export default SimpleInputForm;
