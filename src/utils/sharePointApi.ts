
import { LeaveDate } from './dateUtils';

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
const getSPListApiUrl = (listName: string) => {
  return `_api/web/lists/getbytitle('${listName}')/items`;
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
    const digestResponse = await fetch('_api/contextinfo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      }
    });
    
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
    return false;
  }
};
