import { useState } from "react";
import InboundChatbot from "@/components/ui/InboundChatbot";
import VoiceWidget from "@/components/ui/VoiceWidget";
import SimpleInputForm from "@/components/ui/SimpleInputForm";

const FrontDeskAssistant = () => {
  const [messageTrigger, setMessageTrigger] = useState<{ id: number; text: string } | null>(null);

  const handleSend = (text: string) => {
    setMessageTrigger({ id: Date.now(), text });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-foreground mb-6">Front Desk Assistant</h1>
      <div className="max-w-4xl">
        <p className="text-lg text-muted-foreground mb-6">
          Enhance your customer service experience with our intelligent front desk assistant. 
          Manage appointments, handle inquiries, and provide seamless customer support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Features</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• Automated appointment scheduling</li>
              <li>• Customer inquiry management</li>
              <li>• Real-time availability updates</li>
              <li>• Multi-channel communication</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Benefits</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• 24/7 customer service availability</li>
              <li>• Reduced wait times</li>
              <li>• Improved customer satisfaction</li>
              <li>• Streamlined operations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Text Agent Section */}
      <section className="mt-15">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Text Agent</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <InboundChatbot messageTrigger={messageTrigger} hideInput />
          </div>
          <div>
            <SimpleInputForm onSend={handleSend} />
          </div>
        </div>
      </section>

      {/* Voice Assistant Section */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">Voice Assistant</h2>
        <div className="flex justify-center">
          <VoiceWidget assistantId="16d5985e-864a-4966-88fb-3e6d7f1834fa" />
        </div>
      </section>
    </div>
  );
};

export default FrontDeskAssistant;
