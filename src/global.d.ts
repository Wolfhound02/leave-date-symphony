
// Define SharePoint page context
interface SPPageContextInfo {
  userId: number;
  userDisplayName: string;
  userEmail: string;
  webAbsoluteUrl: string;
  siteAbsoluteUrl: string;
  webTitle: string;
}

// Add SharePoint context to the window object
interface Window {
  _spPageContextInfo?: SPPageContextInfo;
}
