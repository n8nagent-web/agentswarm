import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadFormProps {
  onSubmit: (formData: {
    name: string;
    serviceName: string;
    phoneNumber: string;
    email: string;
  }) => void;
}

const LeadForm = ({ onSubmit }: LeadFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    serviceName: "",
    phoneNumber: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.serviceName && formData.phoneNumber && formData.email) {
      onSubmit(formData);
      setFormData({ name: "", serviceName: "", phoneNumber: "", email: "" });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">Contact Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-card-foreground">Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter your name"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="serviceName" className="text-card-foreground">Service Name</Label>
          <Input
            id="serviceName"
            type="text"
            value={formData.serviceName}
            onChange={handleChange("serviceName")}
            placeholder="Enter service of interest"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phoneNumber" className="text-card-foreground">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            placeholder="Enter your phone number"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-card-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Enter your email"
            className="mt-1"
            required
          />
        </div>
        
        <Button type="submit" className="w-full mt-6">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default LeadForm;