const LeadGenerationAssistant = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-foreground mb-6">Lead Generation Assistant</h1>
      <div className="max-w-4xl">
        <p className="text-lg text-muted-foreground mb-6">
          Discover and qualify high-quality prospects automatically. 
          Our lead generation assistant helps you build a robust sales pipeline.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Tools</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• AI-powered prospect research</li>
              <li>• Automated outreach campaigns</li>
              <li>• Lead qualification scoring</li>
              <li>• CRM integration</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Outcomes</h3>
            <ul className="space-y-2 text-card-foreground">
              <li>• Expanded prospect database</li>
              <li>• Higher quality leads</li>
              <li>• Reduced manual research time</li>
              <li>• Improved sales efficiency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadGenerationAssistant;