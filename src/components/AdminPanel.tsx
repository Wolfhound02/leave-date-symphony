
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { parseCSVData, LeaveDate } from '../utils/dateUtils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileUp, FileSpreadsheet } from 'lucide-react';

interface AdminPanelProps {
  onDataImport: (data: LeaveDate[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onDataImport }) => {
  const [csvData, setCsvData] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImport = () => {
    try {
      if (!csvData.trim()) {
        toast.error('Please enter CSV data');
        return;
      }
      
      const parsedData = parseCSVData(csvData);
      onDataImport(parsedData);
      toast.success(`Successfully imported ${parsedData.length} leave dates`);
      setCsvData('');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(`Import failed: ${(error as Error).message}`);
    }
  };

  const sampleCsvFormat = `Date,MaxSlots
2025-04-15,3
2025-04-16,3
2025-04-17,2`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ms-blue hover:bg-ms-darkBlue">
              <Upload className="mr-2 h-4 w-4" /> Import from Excel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Import Leave Date Data</DialogTitle>
              <DialogDescription>
                Paste CSV data exported from Excel or SharePoint here. 
                The data should include a Date column (YYYY-MM-DD) and MaxSlots column.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-ms-blue" />
                <span className="text-sm font-medium">Example format:</span>
              </div>
              <code className="bg-gray-100 p-2 rounded text-sm">
                {sampleCsvFormat}
              </code>
              <Textarea
                placeholder="Paste your CSV data here..."
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-ms-blue hover:bg-ms-darkBlue" onClick={handleImport}>
                <FileUp className="mr-2 h-4 w-4" /> Import Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        Use this panel to import leave date data from Excel or SharePoint. 
        You can also export current bookings for reporting.
      </p>
      
      <div className="flex space-x-4">
        <Button variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Bookings
        </Button>
      </div>
    </div>
  );
};

export default AdminPanel;
