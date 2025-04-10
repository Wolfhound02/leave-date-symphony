
import React, { useState } from 'react';
import { format, parseISO, getMonth, getYear } from 'date-fns';
import { LeaveDate, getMonthDays } from '../utils/dateUtils';
import DateCard from './DateCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  leaveDates: LeaveDate[];
  userId: string;
  onBookDate: (date: string) => void;
  onCancelDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ leaveDates, userId, onBookDate, onCancelDate }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(getMonth(today) + 1); // 1-12
  const [currentYear, setCurrentYear] = useState(getYear(today));

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const days = getMonthDays(currentYear, currentMonth);

  const findLeaveDate = (date: Date): LeaveDate | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return leaveDates.find(ld => ld.date === dateStr);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">{format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')}</h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const leaveDate = findLeaveDate(day);
          
          // Add empty cells for days before the first day of the month
          if (index === 0) {
            const firstDayOfWeek = day.getDay();
            const emptyCells = Array(firstDayOfWeek).fill(null);
            return (
              <React.Fragment key={`empty-cells-${index}`}>
                {emptyCells.map((_, i) => (
                  <div key={`empty-${i}`} className="h-24"></div>
                ))}
                {leaveDate ? (
                  <DateCard 
                    leaveDate={leaveDate} 
                    userId={userId}
                    onBook={onBookDate}
                    onCancel={onCancelDate}
                  />
                ) : (
                  <div className="border rounded-md p-4 opacity-50 bg-gray-50">
                    <div className="text-lg font-semibold">{format(day, 'EEE')}</div>
                    <div className="text-2xl font-bold">{format(day, 'd')}</div>
                    <div className="text-sm text-gray-500">Not available</div>
                  </div>
                )}
              </React.Fragment>
            );
          }
          
          return leaveDate ? (
            <DateCard 
              key={format(day, 'yyyy-MM-dd')} 
              leaveDate={leaveDate} 
              userId={userId}
              onBook={onBookDate}
              onCancel={onCancelDate}
            />
          ) : (
            <div key={format(day, 'yyyy-MM-dd')} className="border rounded-md p-4 opacity-50 bg-gray-50">
              <div className="text-lg font-semibold">{format(day, 'EEE')}</div>
              <div className="text-2xl font-bold">{format(day, 'd')}</div>
              <div className="text-sm text-gray-500">Not available</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
