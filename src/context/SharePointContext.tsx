
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member } from '../utils/dateUtils';
import { toast } from 'sonner';

interface SharePointContextType {
  currentUser: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isSharePointEnvironment: boolean;
}

const SharePointContext = createContext<SharePointContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isSharePointEnvironment: false
});

export const useSharePoint = () => useContext(SharePointContext);

export const SharePointProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharePointEnvironment, setIsSharePointEnvironment] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Check if we're in a SharePoint context
        const spContext = window._spPageContextInfo;
        setIsSharePointEnvironment(!!spContext);
        
        if (spContext) {
          console.log("Running in SharePoint environment");
          // This is how we would get user info in SharePoint
          const userEmail = spContext.userEmail;
          const userName = spContext.userDisplayName;
          const userId = userEmail || `user_${spContext.userId}`;
          
          setCurrentUser({
            id: userId,
            name: userName || 'SharePoint User',
            bookedDates: []
          });
          setIsAuthenticated(true);
          setIsLoading(false);
          toast.success(`Welcome, ${userName || 'SharePoint User'}`);
        } else {
          console.log("Development mode: Using mock SharePoint user");
          // Simulate a delay to mimic API call
          setTimeout(() => {
            setCurrentUser({
              id: 'user1@example.com',
              name: 'John Smith (Dev Mode)',
              bookedDates: []
            });
            setIsAuthenticated(true);
            setIsLoading(false);
            toast.info('Running in development mode with mock user');
          }, 1000);
        }
      } catch (err) {
        console.error("Error fetching SharePoint user:", err);
        setError("Failed to authenticate with SharePoint");
        setIsLoading(false);
        toast.error("Authentication failed. Please refresh the page.");
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <SharePointContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      isLoading, 
      error, 
      isSharePointEnvironment 
    }}>
      {children}
    </SharePointContext.Provider>
  );
};
