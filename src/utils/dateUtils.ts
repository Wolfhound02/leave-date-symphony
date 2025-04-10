
import { format, parseISO, isWeekend, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export interface LeaveDate {
  date: string;
  maxSlots: number;
  bookedSlots: number;
  bookedBy: string[];
}

export interface Member {
  id: string;
  name: string;
  bookedDates: string[];
}

// Check if a given date has available slots
export const hasAvailableSlots = (leaveDate: LeaveDate): boolean => {
  return leaveDate.bookedSlots < leaveDate.maxSlots;
};

// Format date for display
export const formatDateForDisplay = (dateStr: string): string => {
  return format(parseISO(dateStr), 'MMM d, yyyy');
};

// Format date for ID/key
export const formatDateForId = (dateStr: string): string => {
  return format(parseISO(dateStr), 'yyyy-MM-dd');
};

// Get month days
export const getMonthDays = (year: number, month: number): Date[] => {
  const firstDay = startOfMonth(new Date(year, month - 1));
  const lastDay = endOfMonth(firstDay);
  
  return eachDayOfInterval({ start: firstDay, end: lastDay });
};

// Check if user has already booked this date
export const hasUserBookedDate = (date: string, userId: string, leaveDates: LeaveDate[]): boolean => {
  const leaveDate = leaveDates.find(ld => ld.date === date);
  return leaveDate ? leaveDate.bookedBy.includes(userId) : false;
};

// Parse CSV data from Excel export
export const parseCSVData = (csvData: string): LeaveDate[] => {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  
  const dateIndex = headers.indexOf('Date');
  const maxSlotsIndex = headers.indexOf('MaxSlots');
  
  if (dateIndex === -1 || maxSlotsIndex === -1) {
    throw new Error('CSV format invalid: Date or MaxSlots columns missing');
  }
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      date: values[dateIndex].trim(),
      maxSlots: parseInt(values[maxSlotsIndex].trim(), 10),
      bookedSlots: 0,
      bookedBy: []
    };
  });
};
