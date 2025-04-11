
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
    // In development mode, return mock data
    if (!window._spPageContextInfo) {
      console.log("Development mode: Using mock SharePoint data");
      // Import the sample data in development mode
      const { generateSampleLeaveDates } = await import('../data/sampleData');
      return generateSampleLeaveDates();
    }

    console.log("Fetching data from SharePoint list");
    // In SharePoint, make an actual API call
    const response = await fetch(getSPListApiUrl('LeaveDates'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      }
    });

    if (!response.ok) {
      throw new Error(`SharePoint API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform SharePoint list items to our app format
    return data.d.results.map((item: SPListItem) => ({
      date: item.Date,
      maxSlots: item.MaxSlots,
      bookedSlots: item.BookedSlots || 0,
      bookedBy: item.BookedBy ? item.BookedBy.split(',') : []
    }));
  } catch (error) {
    console.error('Error fetching leave dates from SharePoint:', error);
    toast.error('Failed to load leave dates. Please try again.');
    throw error;
  }
};

// Book a leave date in SharePoint
export const bookLeaveInSharePoint = async (dateId: number, userId: string): Promise<boolean> => {
  // In development mode, just return success
  if (!window._spPageContextInfo) {
    console.log("Development mode: Simulating SharePoint booking");
    return Promise.resolve(true);
  }

  // In SharePoint, make an actual API call
  try {
    // Get request digest for form validation
    const digestResponse = await fetch(`${window._spPageContextInfo.webAbsoluteUrl}/_api/contextinfo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      }
    });
    
    if (!digestResponse.ok) {
      throw new Error('Failed to get form digest value');
    }
    
    const digestData = await digestResponse.json();
    const formDigestValue = digestData.d.GetContextWebInformation.FormDigestValue;
    
    // Update the leave date item
    const response = await fetch(`${getSPListApiUrl('LeaveDates')}(${dateId})`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': formDigestValue,
        'X-HTTP-Method': 'MERGE',
        'IF-MATCH': '*'
      },
      body: JSON.stringify({
        '__metadata': { 'type': 'SP.Data.LeaveDatesListItem' },
        'BookedSlots': { '__increment': 1 },
        'BookedBy': { 'Append': userId }
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error booking leave in SharePoint:', error);
    toast.error('Failed to book leave. Please try again.');
    return false;
  }
};

// Import dates from CSV to SharePoint
export const importDatesToSharePoint = async (leaveDates: LeaveDate[]): Promise<boolean> => {
  if (!window._spPageContextInfo) {
    console.log("Development mode: Simulating SharePoint import");
    return Promise.resolve(true);
  }
  
  try {
    // Get request digest
    const digestResponse = await fetch(`${window._spPageContextInfo.webAbsoluteUrl}/_api/contextinfo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      }
    });
    
    if (!digestResponse.ok) {
      throw new Error('Failed to get form digest value');
    }
    
    const digestData = await digestResponse.json();
    const formDigestValue = digestData.d.GetContextWebInformation.FormDigestValue;
    
    // Create batch of requests to create list items
    const batchPromises = leaveDates.map(async (leaveDate) => {
      const response = await fetch(getSPListApiUrl('LeaveDates'), {
        method: 'POST',
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          'X-RequestDigest': formDigestValue
        },
        body: JSON.stringify({
          '__metadata': { 'type': 'SP.Data.LeaveDatesListItem' },
          'Title': `Leave Date ${leaveDate.date}`,
          'Date': leaveDate.date,
          'MaxSlots': leaveDate.maxSlots,
          'BookedSlots': 0,
          'BookedBy': ''
        })
      });
      
      return response.ok;
    });
    
    const results = await Promise.all(batchPromises);
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error importing dates to SharePoint:', error);
    toast.error('Failed to import dates. Please try again.');
    return false;
  }
};
