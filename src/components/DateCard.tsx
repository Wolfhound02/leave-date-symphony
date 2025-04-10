
import React from 'react';
import { format, parseISO } from 'date-fns';
import { LeaveDate, hasAvailableSlots, hasUserBookedDate } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DateCardProps {
  leaveDate: LeaveDate;
  userId: string;
  onBook: (date: string) => void;
  onCancel: (date: string) => void;
}

const DateCard: React.FC<DateCardProps> = ({ leaveDate, userId, onBook, onCancel }) => {
  const { date, maxSlots, bookedSlots } = leaveDate;
  const available = hasAvailableSlots(leaveDate);
  const isBooked = hasUserBookedDate(date, userId, [leaveDate]);
  const parsedDate = parseISO(date);
  
  const getAvailabilityColor = () => {
    if (isBooked) return 'bg-ms-blue text-white';
    if (!available) return 'bg-ms-red text-white opacity-80';
    if (bookedSlots / maxSlots >= 0.5) return 'bg-ms-yellow';
    return 'bg-ms-green text-white';
  };

  return (
    <div className={`border rounded-md p-4 transition-all ${getAvailabilityColor()}`}>
      <div className="flex flex-col space-y-2">
        <div className="text-lg font-semibold">
          {format(parsedDate, 'EEE')}
        </div>
        <div className="text-2xl font-bold">
          {format(parsedDate, 'd')}
        </div>
        <div className="text-sm">
          {format(parsedDate, 'MMM yyyy')}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={available ? "outline" : "secondary"} className="mt-2">
                {bookedSlots}/{maxSlots} booked
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{maxSlots - bookedSlots} slots available</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {isBooked ? (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onCancel(date)} 
            className="w-full mt-2"
          >
            Cancel
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={!available} 
            onClick={() => onBook(date)}
            className="w-full mt-2"
          >
            Book
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateCard;
