
# SharePoint Deployment Guide for Leave Date Manager

This document outlines how to deploy the Leave Date Manager application to SharePoint.

## Prerequisites

1. SharePoint Online site with appropriate permissions
2. Microsoft 365 account with admin access
3. Basic understanding of SharePoint lists

## Step 1: Create SharePoint Lists

Create a new SharePoint list called "LeaveDates" with the following columns:

- Title (default)
- Date (Date and Time)
- MaxSlots (Number)
- BookedSlots (Number)
- BookedBy (Multiple lines of text)

## Step 2: Build the React App for SharePoint

1. Open the project in your development environment
2. Build the project using:
```
npm run build
```

## Step 3: Deploy to SharePoint

### Option 1: Deploy as a SharePoint web part (recommended)

1. Create a new SharePoint Framework (SPFx) solution
2. Copy the built assets from the `dist` folder to your SPFx project
3. Package and deploy your SPFx solution to the SharePoint App Catalog
4. Add the web part to your SharePoint page

### Option 2: Deploy to SharePoint Site Assets (simpler but less integrated)

1. Create a folder called "LeaveDateManager" in your SharePoint site's "Site Assets" library
2. Upload all files from the `dist` folder to this folder
3. Create a new page on your SharePoint site
4. Add a Script Editor web part to the page
5. Add the following code to the Script Editor:

```html
<div id="root"></div>
<script type="text/javascript" src="/sites/YourSite/SiteAssets/LeaveDateManager/main.js"></script>
```

## Step 4: Configure SharePoint Permissions

Ensure users have appropriate permissions to:

1. Read from the LeaveDates list
2. Update their own booking status

## Step 5: Import Excel Data

1. Navigate to the Admin panel in the app
2. Use the Import from Excel functionality to import your leave date data
3. Ensure the CSV format matches the required format (Date, MaxSlots)

## Troubleshooting

- If authentication issues occur, verify the user has appropriate SharePoint permissions
- For data access issues, check browser console for specific errors
- Ensure the SharePoint lists are properly configured with the correct column names
