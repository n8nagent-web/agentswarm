import { useState, useEffect, useCallback } from "react";
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
}

export const useGoogleSheetData = (sheetUrl: string, refreshInterval = 10000) => {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestRow, setLatestRow] = useState<SheetRow | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const { toast } = useToast();

  const parseCSVData = useCallback((csvText: string): SheetRow[] => {
    const lines = csvText.trim().split(/\r?\n/);
    
    if (lines.length < 2) {
      return [];
    }

    const rows: SheetRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
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
        };
        
        rows.push(rowData);
      }
    }
    
    return rows;
  }, []);

  const fetchData = useCallback(async (showToast = false) => {
    setLoading(true);
    try {
      const response = await fetch(sheetUrl);
      const csvText = await response.text();
      const newData = parseCSVData(csvText);
      
      const previousDataLength = data.length;
      const previousLatestRow = latestRow;
      
      setData(newData);
      
      // Set the latest row (last non-empty row)
      if (newData.length > 0) {
        const latest = newData[newData.length - 1];
        
        // Check if this is a new row or if the latest row has changed
        const isNewRow = newData.length > previousDataLength;
        const isRowUpdated = previousLatestRow && 
          JSON.stringify(latest) !== JSON.stringify(previousLatestRow);
        
        setLatestRow(latest);
        setLastUpdateTime(Date.now());
        
        if (showToast && (isNewRow || isRowUpdated)) {
          toast({
            title: isNewRow ? "New Row Added" : "Latest Row Updated",
            description: isNewRow 
              ? `New data added - Total rows: ${newData.length}`
              : "Latest row data has been updated",
          });
        }
      }
      
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to fetch Google Sheet data: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sheetUrl, parseCSVData, toast, data.length, latestRow]);

  useEffect(() => {
    fetchData(false);
    const interval = setInterval(() => fetchData(true), refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { 
    data, 
    latestRow, 
    loading, 
    error, 
    lastUpdateTime,
    refetch: () => fetchData(true) 
  };
};
