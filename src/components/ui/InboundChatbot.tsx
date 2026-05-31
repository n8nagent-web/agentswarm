import ChatWidget from "@/components/ui/ChatWidget";

interface InboundChatbotProps {
  messageTrigger?: { id: number; text: string } | null;
  hideInput?: boolean;
}

const InboundChatbot = ({ messageTrigger, hideInput }: InboundChatbotProps) => {
  return (
    <ChatWidget
      apiEndpoint="/api/inbound-chatbot"
      messageTrigger={messageTrigger}
      hideInput={hideInput}
    />
  );
};

export default InboundChatbot;
