import { useState } from "react";
import ChatWidget, { FormTrigger } from "@/components/ui/ChatWidget";
import VoiceWidget, { VoiceTrigger } from "@/components/ui/VoiceWidget";
import LeadForm from "@/components/ui/LeadForm";

const SpeedToLeadAssistant = () => {
  const [formTrigger, setFormTrigger] = useState<FormTrigger | null>(null);
  const [voiceTrigger, setVoiceTrigger] = useState<VoiceTrigger | null>(null);

  const handleFormSubmit = (formData: {
    name: string;
    serviceName: string;
    phoneNumber: string;
    email: string;
  }) => {
    setFormTrigger({ id: Date.now(), ...formData });
  };

  const handleVoiceFormSubmit = (formData: {
    name: string;
    serviceName: string;
    phoneNumber: string;
    email: string;
  }) => {
    setVoiceTrigger({ id: Date.now(), ...formData });
  };

  const handleVoiceAgentEnd = () => {
    setVoiceTrigger(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-foreground mb-6">Speed to Lead Assistant</h1>
      <div className="max-w-4xl">
        <p className="text-lg text-muted-foreground mb-6">
          Maximize your conversion rates with lightning-fast lead response capabilities. 
          Our speed to lead assistant ensures no opportunity slips through the cracks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Capabilities</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• Instant lead notifications</li>
              <li>• Automated initial responses</li>
              <li>• Priority lead scoring</li>
              <li>• Performance analytics</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Results</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• Higher conversion rates</li>
              <li>• Faster response times</li>
              <li>• Better lead qualification</li>
              <li>• Increased revenue</li>
            </ul>
          </div>
        </div>
        
        {/* Chat Assistant Section */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Chat Assistant</h2>
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

        {/* Voice Assistant Section */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Voice Assistant</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex justify-center">
              <VoiceWidget
                leadMode
                voiceTrigger={voiceTrigger}
                onAgentEnd={handleVoiceAgentEnd}
              />
            </div>
            <LeadForm onSubmit={handleVoiceFormSubmit} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SpeedToLeadAssistant;
