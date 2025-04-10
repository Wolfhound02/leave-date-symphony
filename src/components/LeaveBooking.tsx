
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import AdminPanel from './AdminPanel';
import { LeaveDate, Member } from '../utils/dateUtils';
import { generateSampleLeaveDates, currentUser, sampleMembers } from '../data/sampleData';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateForDisplay } from '../utils/dateUtils';

const LeaveBooking: React.FC = () => {
  const [leaveDates, setLeaveDates] = useState<LeaveDate[]>([]);
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [userId, setUserId] = useState(currentUser.id);
  const [selectedTab, setSelectedTab] = useState("calendar");
  
  // Initialize with sample data
  useEffect(() => {
    setLeaveDates(generateSampleLeaveDates());
  }, []);
  
  const handleBookDate = (date: string) => {
    setLeaveDates(prev => {
      return prev.map(ld => {
        if (ld.date === date && ld.bookedSlots < ld.maxSlots) {
          return {
            ...ld,
            bookedSlots: ld.bookedSlots + 1,
            bookedBy: [...ld.bookedBy, userId]
          };
        }
        return ld;
      });
    });
    
    setMembers(prev => {
      return prev.map(member => {
        if (member.id === userId) {
          return {
            ...member,
            bookedDates: [...member.bookedDates, date]
          };
        }
        return member;
      });
    });
    
    toast.success(`Leave booked for ${formatDateForDisplay(date)}`);
  };
  
  const handleCancelDate = (date: string) => {
    setLeaveDates(prev => {
      return prev.map(ld => {
        if (ld.date === date && ld.bookedBy.includes(userId)) {
          return {
            ...ld,
            bookedSlots: ld.bookedSlots - 1,
            bookedBy: ld.bookedBy.filter(id => id !== userId)
          };
        }
        return ld;
      });
    });
    
    setMembers(prev => {
      return prev.map(member => {
        if (member.id === userId) {
          return {
            ...member,
            bookedDates: member.bookedDates.filter(d => d !== date)
          };
        }
        return member;
      });
    });
    
    toast.success(`Leave cancelled for ${formatDateForDisplay(date)}`);
  };
  
  const handleDataImport = (importedData: LeaveDate[]) => {
    setLeaveDates(importedData);
  };
  
  const currentUserData = members.find(m => m.id === userId) || currentUser;
  const bookedDates = currentUserData.bookedDates.map(date => {
    const leaveDate = leaveDates.find(ld => ld.date === date);
    return {
      date,
      displayDate: formatDateForDisplay(date),
      maxSlots: leaveDate?.maxSlots || 0,
      bookedSlots: leaveDate?.bookedSlots || 0
    };
  });

  const switchUser = (newUserId: string) => {
    setUserId(newUserId);
    toast.info(`Switched to ${members.find(m => m.id === newUserId)?.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ms-blue mb-2">Team Leave Management</h1>
        <p className="text-gray-600">
          Book your leave dates and view team availability
        </p>
        
        {/* User switcher (for demo only) */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 mr-2">Demo User:</span>
          {members.map(member => (
            <Badge 
              key={member.id}
              variant={userId === member.id ? "default" : "outline"}
              className={`cursor-pointer ${userId === member.id ? 'bg-ms-blue' : ''}`}
              onClick={() => switchUser(member.id)}
            >
              {member.name}
            </Badge>
          ))}
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
            userId={userId}
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
