
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeaveDate } from '../utils/dateUtils';
import { getLeaveDatesFromSharePoint, bookLeaveInSharePoint } from '../utils/sharePointApi';
import { toast } from 'sonner';

export const useLeaveDates = () => {
  return useQuery({
    queryKey: ['leaveDates'],
    queryFn: getLeaveDatesFromSharePoint,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error: Error) => {
      console.error('Error fetching leave dates:', error);
      toast.error('Failed to load leave dates');
    }
  });
};

export const useBookLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({dateId, userId}: {dateId: number, userId: string}) => {
      const result = await bookLeaveInSharePoint(dateId, userId);
      if (!result) {
        throw new Error('Failed to book leave');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch leave dates
      queryClient.invalidateQueries({ queryKey: ['leaveDates'] });
    },
    onError: (error) => {
      console.error('Error booking leave:', error);
      toast.error('Failed to book leave');
    }
  });
};
