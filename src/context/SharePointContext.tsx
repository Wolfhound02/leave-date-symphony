
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member } from '../utils/dateUtils';

interface SharePointContextType {
  currentUser: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const SharePointContext = createContext<SharePointContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
});

export const useSharePoint = () => useContext(SharePointContext);

export const SharePointProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // In a SharePoint environment, we would use the SharePoint REST API
        // to get the current user information.
        // For development purposes, we'll simulate this behavior
        
        // Check if we're in a SharePoint context
        if (window._spPageContextInfo) {
          // This is how we would get user info in SharePoint
          const userEmail = window._spPageContextInfo.userEmail;
          const userName = window._spPageContextInfo.userDisplayName;
          
          setCurrentUser({
            id: userEmail,
            name: userName,
            bookedDates: []
          });
          setIsAuthenticated(true);
        } else {
          // For development outside SharePoint, use a mock user
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
          }, 1000);
        }
      } catch (err) {
        console.error("Error fetching SharePoint user:", err);
        setError("Failed to authenticate with SharePoint");
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <SharePointContext.Provider value={{ currentUser, isAuthenticated, isLoading, error }}>
      {children}
    </SharePointContext.Provider>
  );
};
