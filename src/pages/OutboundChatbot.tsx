import { useState } from "react";
import ChatWidget, { FormTrigger } from "@/components/ui/ChatWidget";
import LeadForm from "@/components/ui/LeadForm";

const OutboundChatbot = () => {
  const [formTrigger, setFormTrigger] = useState<FormTrigger | null>(null);

  const handleFormSubmit = (formData: {
    name: string;
    serviceName: string;
    phoneNumber: string;
    email: string;
  }) => {
    setFormTrigger({ id: Date.now(), ...formData });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-foreground mb-6">Outbound Chatbot</h1>
      <div className="max-w-4xl">
        <p className="text-lg text-muted-foreground mb-6">
          Connect with leads proactively through our outbound chatbot. 
          Submit lead information and start an automated conversation flow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Features</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• Automated outreach</li>
              <li>• Lead qualification</li>
              <li>• Real-time conversations</li>
              <li>• Personalized messaging</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Benefits</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• Increased engagement</li>
              <li>• Better lead nurturing</li>
              <li>• Scalable outreach</li>
              <li>• Higher conversion rates</li>
            </ul>
          </div>
        </div>
        
        {/* Outbound Chat Assistant Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Outbound Chat Assistant</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex justify-center">
              <ChatWidget
                formTrigger={formTrigger}
                apiEndpoint="/api/inbound-chatbot"
                requireActivation
              />
            </div>
            <LeadForm onSubmit={handleFormSubmit} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default OutboundChatbot;
