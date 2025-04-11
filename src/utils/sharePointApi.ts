
import { LeaveDate } from './dateUtils';
import { toast } from 'sonner';

// Type definition for SharePoint list item
interface SPListItem {
  Id: number;
  Title: string;
  Date: string;
  MaxSlots: number;
  BookedSlots: number;
  BookedBy: string;
}

// SharePoint API URL will be relative in a SharePoint-hosted app
const getSPListApiUrl = (listName: string): string => {
  const spContext = window._spPageContextInfo;
  if (!spContext) {
    return `_api/web/lists/getbytitle('${listName}')/items`;
  }
  
  return `${spContext.webAbsoluteUrl}/_api/web/lists/getbytitle('${listName}')/items`;
};

// Get leave dates from a SharePoint list
export const getLeaveDatesFromSharePoint = async (): Promise<LeaveDate[]> => {
  try {
    // When not in SharePoint environment (Netlify), always return mock data
    console.log("Using mock SharePoint data for Netlify environment");
    // Import the sample data for Netlify deployment
    const { generateSampleLeaveDates } = await import('../data/sampleData');
    return generateSampleLeaveDates();
  } catch (error) {
    console.error('Error fetching leave dates:', error);
    toast.error('Failed to load leave dates. Please try again.');
    throw error;
  }
};

// Book a leave date in SharePoint
export const bookLeaveInSharePoint = async (dateId: number, userId: string): Promise<boolean> => {
  // In Netlify environment, just return success with mock data
  console.log("Simulating SharePoint booking in Netlify environment");
  // Add a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(true);
};

// Import dates from CSV to SharePoint
export const importDatesToSharePoint = async (leaveDates: LeaveDate[]): Promise<boolean> => {
  console.log("Simulating SharePoint import in Netlify environment");
  // Add a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(true);
};
