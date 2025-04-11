
import React, { useState } from 'react';
import Calendar from './Calendar';
import AdminPanel from './AdminPanel';
import { LeaveDate } from '../utils/dateUtils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateForDisplay } from '../utils/dateUtils';
import { useSharePoint } from '../context/SharePointContext';
import { useLeaveDates, useBookLeave } from '../hooks/useSharePointData';
import { Loader2 } from 'lucide-react';

const LeaveBooking: React.FC = () => {
  const { currentUser, isSharePointEnvironment, isLoading: authLoading } = useSharePoint();
  const { data: leaveDates = [], isLoading: datesLoading, refetch } = useLeaveDates();
  const bookLeaveMutation = useBookLeave();
  const [selectedTab, setSelectedTab] = useState("calendar");
  
  const handleBookDate = (date: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to book leave');
      return;
    }
    
    const leaveDate = leaveDates.find(ld => ld.date === date);
    if (!leaveDate) {
      toast.error('Date not found');
      return;
    }
    
    // In SharePoint, we would use the actual ID from the list item
    const dateId = isSharePointEnvironment ? leaveDate.id || 0 : 0;
    
    // In development mode, update state directly
    if (!isSharePointEnvironment) {
      // This is just for development - in SharePoint we'd use the mutation
      handleLocalBookDate(date);
      return;
    }
    
    // In SharePoint, use the mutation
    bookLeaveMutation.mutate({
      dateId,
      userId: currentUser.id
    }, {
      onSuccess: () => {
        toast.success(`Leave booked for ${formatDateForDisplay(date)}`);
        refetch();
      }
    });
  };
  
  const handleLocalBookDate = (date: string) => {
    // For development only
    toast.success(`Leave booked for ${formatDateForDisplay(date)} (dev mode)`);
  };
  
  const handleCancelDate = (date: string) => {
    toast.success(`Leave cancelled for ${formatDateForDisplay(date)}`);
    // In a real implementation, we would call a SharePoint API to cancel the booking
  };
  
  const handleDataImport = (importedData: LeaveDate[]) => {
    toast.success(`${importedData.length} leave dates imported`);
    refetch();
  };
  
  const bookedDates = currentUser?.bookedDates.map(date => {
    const leaveDate = leaveDates.find(ld => ld.date === date);
    return {
      date,
      displayDate: formatDateForDisplay(date),
      maxSlots: leaveDate?.maxSlots || 0,
      bookedSlots: leaveDate?.bookedSlots || 0
    };
  }) || [];

  const isLoading = authLoading || datesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-ms-blue" />
          <p className="text-gray-600">Loading leave management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ms-blue mb-2">Team Leave Management</h1>
        <p className="text-gray-600">
          Book your leave dates and view team availability
        </p>
        
        {/* Current user display */}
        <div className="mt-4 flex items-center">
          <span className="text-sm text-gray-500 mr-2">Logged in as:</span>
          <Badge className="bg-ms-blue">
            {currentUser?.name || 'Guest User'}
          </Badge>
          {isSharePointEnvironment && (
            <Badge variant="outline" className="ml-2">
              SharePoint Mode
            </Badge>
          )}
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="mybookings">My Bookings</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <Calendar 
            leaveDates={leaveDates}
            userId={currentUser?.id || ''}
            onBookDate={handleBookDate}
            onCancelDate={handleCancelDate}
          />
        </TabsContent>
        
        <TabsContent value="mybookings" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">My Leave Bookings</h2>
            
            {bookedDates.length > 0 ? (
              <div className="space-y-4">
                {bookedDates.map(booking => (
                  <div key={booking.date} className="flex items-center justify-between p-4 bg-gray-50 border rounded-md">
                    <div>
                      <span className="font-medium">{booking.displayDate}</span>
                      <div className="text-sm text-gray-500">
                        {booking.bookedSlots}/{booking.maxSlots} slots booked
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelDate(booking.date)}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't booked any leave dates yet.</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4">
          <AdminPanel onDataImport={handleDataImport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveBooking;
