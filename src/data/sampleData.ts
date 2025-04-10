
import { LeaveDate, Member } from '../utils/dateUtils';
import { addDays, format } from 'date-fns';

// Generate sample leave dates for the next 30 days
export const generateSampleLeaveDates = (): LeaveDate[] => {
  const today = new Date();
  const leaveDates: LeaveDate[] = [];
  
  for (let i = 1; i <= 60; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Random max slots between 2-4
    const maxSlots = Math.floor(Math.random() * 2) + 2;
    
    leaveDates.push({
      date: dateStr,
      maxSlots: maxSlots,
      bookedSlots: 0,
      bookedBy: []
    });
  }
  
  return leaveDates;
};

// Sample team members
export const sampleMembers: Member[] = [
  { id: 'user1', name: 'John Smith', bookedDates: [] },
  { id: 'user2', name: 'Jane Doe', bookedDates: [] },
  { id: 'user3', name: 'Michael Johnson', bookedDates: [] },
  { id: 'user4', name: 'Emily Williams', bookedDates: [] },
  { id: 'user5', name: 'David Brown', bookedDates: [] },
];

// In a real app, you'd fetch the current user from auth
export const currentUser: Member = sampleMembers[0];
