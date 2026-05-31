const Introduction = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-foreground mb-6">Introduction</h1>
      <div className="max-w-4xl">
        <p className="text-lg text-muted-foreground mb-4">
          Welcome to the Professional Assistant Dashboard. This platform provides access to three powerful AI assistants designed to streamline your business operations.
        </p>
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Available Assistants</h2>
          <ul className="space-y-3 text-card-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Front Desk Assistant:</strong> Streamline customer interactions and manage front office operations efficiently.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Speed to Lead Assistant:</strong> Accelerate your lead response time and maximize conversion opportunities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Lead Generation Assistant:</strong> Discover and qualify new prospects to grow your business pipeline.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Introduction;