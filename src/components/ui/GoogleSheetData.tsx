import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SheetRow {
  fileNo: string;
  mbl: string;
  status: string;
  divisionBusLine: string;
  fileNumber: string;
  masterBillNo: string;
  houseBillNo: string;
  ltNumber: string;
  entryNumber: string;
  customerReference: string;
  originReference: string;
  controller: string;
  account: string;
  broker: string;
  importerConsignee: string;
  brokerContact: string;
  manufacturerShipper: string;
  notify: string;
  alsoNotify: string;
  forwarder: string;
  serviceLevel: string;
  trucker: string;
  carrier: string;
  vessel: string;
  voyFlight: string;
  moveType: string;
  houseBillIssuerSCAC: string;
  headload: string;
  typeOfService: string;
  portOfDischarge: string;
  eta: string;
  pterRamp: string;
  deliveryETA: string;
  cfsETADate: string;
  cfsETATime: string;
  containerNo: string;
  cntrSizeType: string;
  seals: string;
  marksNumbers: string;
  pieces: string;
  type: string;
  description: string;
  lbs: string;
  kgs: string;
  cft: string;
  cbm: string;
  chargeableLbs: string;
  chargeableKgs: string;
  cfsCargoLoc: string;
  pickupAt: string;
  returnTo: string;
  freeDays: string;
  freetimeEnds: string;
  ppdCct: string;
  inputDate: string;
  pickedUp: string;
  stripped: string;
  returned: string;
  wineRackBin: string;
  goDate: string;
  serviceContact: string;
  cargoControlNumber: string;
  previousCargoControlNumber: string;
  insurance: string;
  released: string;
  oblReqd: string;
  isNew?: boolean;
}

interface GoogleSheetDataProps {
  sheetUrl: string;
  refreshInterval?: number;
}

const GoogleSheetData = ({ sheetUrl, refreshInterval = 30000 }: GoogleSheetDataProps) => {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [lastRowCount, setLastRowCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  console.log('GoogleSheetData component mounted with URL:', sheetUrl);

  const parseCSVData = useCallback((csvText: string): SheetRow[] => {
    console.log('Raw CSV data preview:', csvText.substring(0, 500));
    console.log('Full CSV length:', csvText.length);
    
    // Handle different line endings
    const lines = csvText.trim().split(/\r?\n/);
    console.log('CSV lines count:', lines.length);
    
    if (lines.length < 2) {
      console.log('Not enough CSV lines, returning empty array');
      return [];
    }

    // Find the header line (first non-empty line)
    const headerLine = lines.find(line => line.trim().length > 0);
    if (!headerLine) {
      console.log('No valid header line found');
      return [];
    }
    
    const rows: SheetRow[] = [];

    // Process data rows (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      // Split by comma but handle quoted fields
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      console.log(`Row ${i} first few values:`, values.slice(0, 10));
      
      // Check if this row has meaningful data (at least MBL or File Number)
      const mbl = values[1] || '';
      const fileNumber = values[4] || '';
      
      if (mbl || fileNumber) {
        const rowData: SheetRow = {
          fileNo: values[0] || '',
          mbl: values[1] || '',
          status: values[2] || '',
          divisionBusLine: values[3] || '',
          fileNumber: values[4] || '',
          masterBillNo: values[5] || '',
          houseBillNo: values[6] || '',
          ltNumber: values[7] || '',
          entryNumber: values[8] || '',
          customerReference: values[9] || '',
          originReference: values[10] || '',
          controller: values[11] || '',
          account: values[12] || '',
          broker: values[13] || '',
          importerConsignee: values[14] || '',
          brokerContact: values[15] || '',
          manufacturerShipper: values[16] || '',
          notify: values[17] || '',
          alsoNotify: values[18] || '',
          forwarder: values[19] || '',
          serviceLevel: values[20] || '',
          trucker: values[21] || '',
          carrier: values[22] || '',
          vessel: values[23] || '',
          voyFlight: values[24] || '',
          moveType: values[25] || '',
          houseBillIssuerSCAC: values[26] || '',
          headload: values[28] || '',
          typeOfService: values[29] || '',
          portOfDischarge: values[30] || '',
          eta: values[31] || '',
          pterRamp: values[32] || '',
          deliveryETA: values[34] || '',
          cfsETADate: values[35] || '',
          cfsETATime: values[37] || '',
          containerNo: values[39] || '',
          cntrSizeType: values[40] || '',
          seals: values[41] || '',
          marksNumbers: values[42] || '',
          pieces: values[43] || '',
          type: values[44] || '',
          description: values[45] || '',
          lbs: values[46] || '',
          kgs: values[47] || '',
          cft: values[48] || '',
          cbm: values[49] || '',
          chargeableLbs: values[50] || '',
          chargeableKgs: values[51] || '',
          cfsCargoLoc: values[52] || '',
          pickupAt: values[53] || '',
          returnTo: values[54] || '',
          freeDays: values[55] || '',
          freetimeEnds: values[56] || '',
          ppdCct: values[57] || '',
          inputDate: values[58] || '',
          pickedUp: values[59] || '',
          stripped: values[60] || '',
          returned: values[61] || '',
          wineRackBin: values[62] || '',
          goDate: values[63] || '',
          serviceContact: values[64] || '',
          cargoControlNumber: values[65] || '',
          previousCargoControlNumber: values[66] || '',
          insurance: values[67] || '',
          released: values[68] || '',
          oblReqd: values[69] || '',
          isNew: false
        };
        
        rows.push(rowData);
        console.log(`Added row with MBL: ${mbl}, File Number: ${fileNumber}`);
      }
    }
    
    console.log('Final parsed rows:', rows.length);
    return rows;
  }, []);

  const fetchData = useCallback(async (markNewRows = false) => {
    setLoading(true);
    try {
      console.log('Fetching data from:', sheetUrl);
      const response = await fetch(sheetUrl);
      console.log('Response status:', response.status);
      const csvText = await response.text();
      console.log('CSV text length:', csvText.length);
      const newData = parseCSVData(csvText);
      console.log('Parsed data rows:', newData.length);
      
      if (markNewRows && newData.length > lastRowCount) {
        const newRowsCount = newData.length - lastRowCount;
        // Mark new rows
        for (let i = newData.length - newRowsCount; i < newData.length; i++) {
          newData[i].isNew = true;
        }
        
        if (newRowsCount > 0) {
          toast({
            title: "New Data Added",
            description: `${newRowsCount} new row(s) added to the sheet`,
          });
        }
      }
      
      setData(newData);
      setLastRowCount(newData.length);
      setError(null);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', {
        message: errorMessage,
        name: error instanceof Error ? error.name : 'Unknown',
      });
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to fetch Google Sheet data: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sheetUrl, parseCSVData, lastRowCount, toast]);

  useEffect(() => {
    fetchData(false);
    const interval = setInterval(() => fetchData(true), refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading Google Sheet data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-2">Error: {error}</p>
        <p className="text-muted-foreground mb-4">Failed to load Google Sheet data</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available in the Google Sheet</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Google Sheet Data</h3>
          <Badge variant="secondary">{data.length} records</Badge>
        </div>
        <Button onClick={handleRefresh} disabled={loading} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File No</TableHead>
                <TableHead>MBL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Division/Bus Line</TableHead>
                <TableHead>File Number</TableHead>
                <TableHead>Master Bill No</TableHead>
                <TableHead>House Bill No</TableHead>
                <TableHead>Importer/Consignee</TableHead>
                <TableHead>Manufacturer/Shipper</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Container No</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Weight (Lbs)</TableHead>
                <TableHead>Weight (Kgs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow 
                  key={`${row.fileNo}-${index}`}
                  className={row.isNew ? "bg-green-50 dark:bg-green-900/20 animate-pulse" : ""}
                >
                  <TableCell className="font-medium">
                    {row.fileNo}
                    {row.isNew && <Badge className="ml-2" variant="default">NEW</Badge>}
                  </TableCell>
                  <TableCell>{row.mbl}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.divisionBusLine}</TableCell>
                  <TableCell>{row.fileNumber}</TableCell>
                  <TableCell>{row.masterBillNo}</TableCell>
                  <TableCell>{row.houseBillNo}</TableCell>
                  <TableCell>{row.importerConsignee}</TableCell>
                  <TableCell>{row.manufacturerShipper}</TableCell>
                  <TableCell>{row.vessel}</TableCell>
                  <TableCell>{row.eta}</TableCell>
                  <TableCell>{row.containerNo}</TableCell>
                  <TableCell className="max-w-xs truncate">{row.description}</TableCell>
                  <TableCell>{row.lbs}</TableCell>
                  <TableCell>{row.kgs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetData;