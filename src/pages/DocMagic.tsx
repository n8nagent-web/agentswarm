import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, CloudUpload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import GoogleSheetData from "@/components/ui/GoogleSheetData";
import { useGoogleSheetData } from "@/hooks/useGoogleSheetData";
import { Badge } from "@/components/ui/badge";

const DocMagic = () => {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1OrcU4asl7MOOpngnryjPLIvz006AI8qEvywaXOFLBd0/export?format=csv";
  const { latestRow, loading: sheetLoading, lastUpdateTime, refetch } = useGoogleSheetData(SHEET_URL);

  // Form state management
  const [formData, setFormData] = useState({
    division: "",
    busLine: "",
    fileNumber: "",
    masterBillNo: "",
    houseBillNo: "",
    itNumber: "",
    entryNumber: "",
    customerReference: "",
    originReference: "",
    controller: "",
    account: "",
    importerConsignee: "",
    manufacturerShipper: "",
    notify: "",
    alsoNotify: "",
    forwarder: "",
    trucker: "",
    carrier: "",
    vessel: "",
    voyFlight: "",
    moveType: "",
    portOfLoad: "",
    etd: null as Date | null,
    portOfDischarge: "",
    eta: null as Date | null,
    placeOfDelivery: "",
    deliveryEta: null as Date | null,
    containerNo: "",
    cntrSizeType: "",
    seals: "",
    marksNumbers: "",
    pieces: "",
    type: "",
    description: "",
    lbs: "",
    kgs: "",
    cft: "",
    cbm: "",
    chargeableLbs: "",
    chargeableKgs: "",
    freeDays: "",
    freetimeEnds: null as Date | null,
    inputDate: null as Date | null,
    pickedUp: null as Date | null,
    insurance: false,
    released: false,
    oblReqd: false,
  });

  // Helper function to safely parse dates
  const parseDateSafely = (dateString: string): Date | null => {
    if (!dateString || dateString.trim() === '') return null;
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  };

  // Update form data when latest row changes
  useEffect(() => {
    if (latestRow) {
      setFormData(prev => ({
        ...prev,
        division: latestRow.divisionBusLine.split(',')[0]?.trim() || '',
        busLine: latestRow.divisionBusLine.split(',')[1]?.trim() || '',
        fileNumber: latestRow.fileNumber || '',
        masterBillNo: latestRow.masterBillNo || '',
        houseBillNo: latestRow.houseBillNo || '',
        itNumber: latestRow.ltNumber || '',
        entryNumber: latestRow.entryNumber || '',
        customerReference: latestRow.customerReference || '',
        originReference: latestRow.originReference || '',
        controller: latestRow.controller || '',
        account: latestRow.account || '',
        importerConsignee: latestRow.importerConsignee || '',
        manufacturerShipper: latestRow.manufacturerShipper || '',
        notify: latestRow.notify || '',
        alsoNotify: latestRow.alsoNotify || '',
        forwarder: latestRow.forwarder || '',
        trucker: latestRow.trucker || '',
        carrier: latestRow.carrier || '',
        vessel: latestRow.vessel || '',
        voyFlight: latestRow.voyFlight || '',
        moveType: latestRow.moveType || '',
        portOfLoad: '',
        etd: null,
        portOfDischarge: latestRow.portOfDischarge || '',
        eta: parseDateSafely(latestRow.eta),
        placeOfDelivery: latestRow.pterRamp || '',
        deliveryEta: parseDateSafely(latestRow.deliveryETA),
        containerNo: latestRow.containerNo || '',
        cntrSizeType: latestRow.cntrSizeType || '',
        seals: latestRow.seals || '',
        marksNumbers: latestRow.marksNumbers || '',
        pieces: latestRow.pieces || '',
        type: latestRow.type || '',
        description: latestRow.description || '',
        lbs: latestRow.lbs || '',
        kgs: latestRow.kgs || '',
        cft: latestRow.cft || '',
        cbm: latestRow.cbm || '',
        chargeableLbs: latestRow.chargeableLbs || '',
        chargeableKgs: latestRow.chargeableKgs || '',
        freeDays: latestRow.freeDays || '',
        freetimeEnds: parseDateSafely(latestRow.freetimeEnds),
        inputDate: parseDateSafely(latestRow.inputDate),
        pickedUp: parseDateSafely(latestRow.pickedUp),
        insurance: latestRow.insurance === 'true' || latestRow.insurance === 'yes',
        released: latestRow.released === 'true' || latestRow.released === 'yes',
        oblReqd: latestRow.oblReqd === 'true' || latestRow.oblReqd === 'yes',
      }));
    }
  }, [latestRow]);

  const handleInputChange = (field: string, value: string | Date | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const SearchInput = ({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (value: string) => void }) => (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-8"
      />
      <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Section 1: Feature Introduction */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Doc Magic: Intelligent Document Processing
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Crucial Use Cases</h3>
            <p className="text-muted-foreground">
              Transform Bills of Lading, Invoices, and Purchase Orders processing. 
              Eliminate manual data entry and reduce processing time from hours to minutes 
              with intelligent document recognition.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Unmatched Accuracy</h3>
            <p className="text-muted-foreground">
              Our advanced OCR engine extracts data with over 99% accuracy, 
              significantly reducing costly errors and ensuring reliable data capture 
              from even complex document layouts.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Powerful Capabilities</h3>
            <p className="text-muted-foreground">
              Handle various document formats, learn from new document types, 
              and integrate seamlessly with your existing workflow systems 
              for maximum efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Data Entry Form */}
      <div className="bg-card p-8 rounded-xl border border-border mt-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-card-foreground">Document Information Form</h2>
            {sheetLoading && <Badge variant="secondary">Syncing...</Badge>}
            {latestRow && !sheetLoading && (
              <Badge variant="default">
                Auto-sync active (updates every 10s)
              </Badge>
            )}
          </div>
          <Button onClick={refetch} variant="outline" size="sm" disabled={sheetLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${sheetLoading ? 'animate-spin' : ''}`} />
            Refresh Now
          </Button>
        </div>
        {lastUpdateTime > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            Last synced: {new Date(lastUpdateTime).toLocaleTimeString()}
          </p>
        )}
        
        <form className="space-y-8">
          {/* Top Header Group */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div>
              <Label htmlFor="division">Division</Label>
              <Input
                id="division"
                value={formData.division}
                onChange={(e) => handleInputChange("division", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="busLine">Bus. Line</Label>
              <Input
                id="busLine"
                value={formData.busLine}
                onChange={(e) => handleInputChange("busLine", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fileNumber">File Number</Label>
              <Input
                id="fileNumber"
                value={formData.fileNumber}
                onChange={(e) => handleInputChange("fileNumber", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="masterBillNo">Master Bill No.</Label>
              <Input
                id="masterBillNo"
                value={formData.masterBillNo}
                onChange={(e) => handleInputChange("masterBillNo", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="houseBillNo">House Bill No.</Label>
              <Input
                id="houseBillNo"
                value={formData.houseBillNo}
                onChange={(e) => handleInputChange("houseBillNo", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="itNumber">I.T. Number</Label>
              <Input
                id="itNumber"
                value={formData.itNumber}
                onChange={(e) => handleInputChange("itNumber", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="entryNumber">Entry Number</Label>
              <Input
                id="entryNumber"
                value={formData.entryNumber}
                onChange={(e) => handleInputChange("entryNumber", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* References Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customerReference">Customer Reference</Label>
              <Input
                id="customerReference"
                value={formData.customerReference}
                onChange={(e) => handleInputChange("customerReference", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="originReference">Origin Reference</Label>
              <Input
                id="originReference"
                value={formData.originReference}
                onChange={(e) => handleInputChange("originReference", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="controller">Controller</Label>
              <Input
                id="controller"
                value={formData.controller}
                onChange={(e) => handleInputChange("controller", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Parties Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="account">Account</Label>
              <SearchInput
                placeholder="Search account..."
                value={formData.account}
                onChange={(value) => handleInputChange("account", value)}
              />
            </div>
            <div>
              <Label htmlFor="importerConsignee">Importer/Consignee</Label>
              <SearchInput
                placeholder="Search importer..."
                value={formData.importerConsignee}
                onChange={(value) => handleInputChange("importerConsignee", value)}
              />
            </div>
            <div>
              <Label htmlFor="manufacturerShipper">Manufacturer/Shipper</Label>
              <SearchInput
                placeholder="Search shipper..."
                value={formData.manufacturerShipper}
                onChange={(value) => handleInputChange("manufacturerShipper", value)}
              />
            </div>
            <div>
              <Label htmlFor="notify">Notify</Label>
              <SearchInput
                placeholder="Search notify party..."
                value={formData.notify}
                onChange={(value) => handleInputChange("notify", value)}
              />
            </div>
            <div>
              <Label htmlFor="alsoNotify">Also Notify</Label>
              <SearchInput
                placeholder="Search also notify..."
                value={formData.alsoNotify}
                onChange={(value) => handleInputChange("alsoNotify", value)}
              />
            </div>
            <div>
              <Label htmlFor="forwarder">Forwarder</Label>
              <SearchInput
                placeholder="Search forwarder..."
                value={formData.forwarder}
                onChange={(value) => handleInputChange("forwarder", value)}
              />
            </div>
            <div>
              <Label htmlFor="trucker">Trucker</Label>
              <SearchInput
                placeholder="Search trucker..."
                value={formData.trucker}
                onChange={(value) => handleInputChange("trucker", value)}
              />
            </div>
          </div>

          {/* Transportation Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={formData.carrier}
                onChange={(e) => handleInputChange("carrier", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="vessel">Vessel</Label>
              <Input
                id="vessel"
                value={formData.vessel}
                onChange={(e) => handleInputChange("vessel", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="voyFlight">Voy/Flight</Label>
              <Input
                id="voyFlight"
                value={formData.voyFlight}
                onChange={(e) => handleInputChange("voyFlight", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="moveType">Move Type</Label>
              <Input
                id="moveType"
                value={formData.moveType}
                onChange={(e) => handleInputChange("moveType", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="portOfLoad">Port of Load</Label>
              <Input
                id="portOfLoad"
                value={formData.portOfLoad}
                onChange={(e) => handleInputChange("portOfLoad", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="etd">ETD</Label>
              <DatePicker
                selected={formData.etd}
                onChange={(date: Date | null) => handleInputChange("etd", date)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground mt-1"
                placeholderText="Select ETD"
              />
            </div>
            <div>
              <Label htmlFor="portOfDischarge">Port of Discharge</Label>
              <Input
                id="portOfDischarge"
                value={formData.portOfDischarge}
                onChange={(e) => handleInputChange("portOfDischarge", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eta">ETA</Label>
              <DatePicker
                selected={formData.eta}
                onChange={(date: Date | null) => handleInputChange("eta", date)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground mt-1"
                placeholderText="Select ETA"
              />
            </div>
            <div>
              <Label htmlFor="placeOfDelivery">Place of Delivery</Label>
              <Input
                id="placeOfDelivery"
                value={formData.placeOfDelivery}
                onChange={(e) => handleInputChange("placeOfDelivery", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="deliveryEta">Delivery ETA</Label>
              <DatePicker
                selected={formData.deliveryEta}
                onChange={(date: Date | null) => handleInputChange("deliveryEta", date)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground mt-1"
                placeholderText="Select Delivery ETA"
              />
            </div>
          </div>

          {/* Cargo Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="containerNo">Container No.</Label>
              <Input
                id="containerNo"
                value={formData.containerNo}
                onChange={(e) => handleInputChange("containerNo", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cntrSizeType">Cntr Size/Type</Label>
              <Input
                id="cntrSizeType"
                value={formData.cntrSizeType}
                onChange={(e) => handleInputChange("cntrSizeType", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="seals">Seals</Label>
              <Input
                id="seals"
                value={formData.seals}
                onChange={(e) => handleInputChange("seals", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pieces">Pieces</Label>
              <Input
                id="pieces"
                value={formData.pieces}
                onChange={(e) => handleInputChange("pieces", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="lg:col-span-6">
              <Label htmlFor="marksNumbers">Marks and Numbers</Label>
              <Textarea
                id="marksNumbers"
                value={formData.marksNumbers}
                onChange={(e) => handleInputChange("marksNumbers", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="lg:col-span-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="lbs">Lbs</Label>
              <Input
                id="lbs"
                type="number"
                value={formData.lbs}
                onChange={(e) => handleInputChange("lbs", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="kgs">Kgs</Label>
              <Input
                id="kgs"
                type="number"
                value={formData.kgs}
                onChange={(e) => handleInputChange("kgs", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cft">CFT</Label>
              <Input
                id="cft"
                type="number"
                value={formData.cft}
                onChange={(e) => handleInputChange("cft", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cbm">CBM</Label>
              <Input
                id="cbm"
                type="number"
                value={formData.cbm}
                onChange={(e) => handleInputChange("cbm", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="chargeableLbs">Chargeable Lbs</Label>
              <Input
                id="chargeableLbs"
                type="number"
                value={formData.chargeableLbs}
                onChange={(e) => handleInputChange("chargeableLbs", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="chargeableKgs">Chargeable Kgs</Label>
              <Input
                id="chargeableKgs"
                type="number"
                value={formData.chargeableKgs}
                onChange={(e) => handleInputChange("chargeableKgs", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Additional Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="freeDays">Free Days</Label>
              <Input
                id="freeDays"
                type="number"
                value={formData.freeDays}
                onChange={(e) => handleInputChange("freeDays", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="freetimeEnds">Freetime Ends</Label>
              <DatePicker
                selected={formData.freetimeEnds}
                onChange={(date: Date | null) => handleInputChange("freetimeEnds", date)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground mt-1"
                placeholderText="Select date"
              />
            </div>
            <div>
              <Label htmlFor="inputDate">Input Date</Label>
              <DatePicker
                selected={formData.inputDate}
                onChange={(date: Date | null) => handleInputChange("inputDate", date)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground mt-1"
                placeholderText="Select date"
              />
            </div>
            <div>
              <Label htmlFor="pickedUp">Picked Up</Label>
              <DatePicker
                selected={formData.pickedUp}
                onChange={(date: Date | null) => handleInputChange("pickedUp", date)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground mt-1"
                placeholderText="Select date"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="insurance"
                checked={formData.insurance}
                onCheckedChange={(checked) => handleInputChange("insurance", checked as boolean)}
              />
              <Label htmlFor="insurance">Insurance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="released"
                checked={formData.released}
                onCheckedChange={(checked) => handleInputChange("released", checked as boolean)}
              />
              <Label htmlFor="released">Released</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="oblReqd"
                checked={formData.oblReqd}
                onCheckedChange={(checked) => handleInputChange("oblReqd", checked as boolean)}
              />
              <Label htmlFor="oblReqd">OB/L Req'd</Label>
            </div>
          </div>

          <Button type="submit" className="w-full mt-8">
            Process Document
          </Button>
        </form>
      </div>

      {/* Section 3: Google Sheet Data Integration */}
      <div className="bg-card p-8 rounded-xl border border-border mt-8">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">Live Google Sheet Data</h2>
        <GoogleSheetData 
          sheetUrl="https://docs.google.com/spreadsheets/d/1OrcU4asl7MOOpngnryjPLIvz006AI8qEvywaXOFLBd0/export?format=csv"
          refreshInterval={30000}
        />
      </div>

      {/* Section 4: PDF Upload Utility */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-8">Or, Upload Your Document</h2>
        
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 hover:border-primary/50 transition-colors cursor-pointer bg-card">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <CloudUpload className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  Drag & drop PDF here
                </h3>
                <p className="text-muted-foreground">
                  or click to browse your files
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DocMagic;