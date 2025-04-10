
# Step-by-Step SharePoint Deployment Guide

## Prerequisites
1. SharePoint Online site with appropriate permissions (Site Owner or Site Collection Administrator)
2. Microsoft 365 account with admin access
3. Visual Studio Code or similar code editor
4. Node.js and npm installed on your computer

## Step 1: Prepare Your SharePoint Environment

### Create the Required SharePoint List
1. Navigate to your SharePoint site
2. Click on **+ New** > **List**
3. Name it "LeaveDates"
4. Add the following columns:
   - **Date**: Date and Time column
   - **MaxSlots**: Number column
   - **BookedSlots**: Number column (default value: 0)
   - **BookedBy**: Multiple lines of text column

## Step 2: Build the React App for SharePoint

1. Clone or download the Leave Date Manager app source code
2. Open a terminal in the project folder
3. Run the following commands:
```bash
npm install
npm run build
```
4. The build process will generate optimized files in the `dist` folder

## Step 3: Upload the Built Files to SharePoint

### Option 1: Upload to Site Assets (Easiest Method)
1. Navigate to your SharePoint site
2. Click on **Settings (gear icon)** > **Site contents**
3. Find or create the "Site Assets" library
4. Create a new folder called "LeaveDateManager"
5. Upload all files from your local `dist` folder to this folder
   - You can use drag-and-drop or the Upload button
   - Make sure to maintain the folder structure

### Option 2: Create a SharePoint App Package (More Professional)
1. Create a `.spapp` package using a tool like [sp-client-custom-fields](https://github.com/OlivierCC/sp-client-custom-fields)
2. Upload the app package to your SharePoint App Catalog
3. Install the app on your target site

## Step 4: Add the App to a SharePoint Page

1. Navigate to the SharePoint page where you want to add the app
2. Click **Edit** to enter edit mode
3. Add a new web part: click the **+** icon
4. Search for and add a **Script Editor** web part
   - Note: If Script Editor isn't available, you may need to add the "Classic" Script Editor from the SharePoint Store
5. Click **Edit Snippet** and add the following code:

```html
<div id="root"></div>
<script type="text/javascript" src="/sites/YourSiteName/SiteAssets/LeaveDateManager/assets/index-[hash].js"></script>
<link rel="stylesheet" href="/sites/YourSiteName/SiteAssets/LeaveDateManager/assets/index-[hash].css">
```

6. Replace `YourSiteName` with your actual SharePoint site name
7. Replace `[hash]` with the actual hash value in the filenames from your dist folder
8. Click **Insert** and **Save** the page

## Step 5: Configure SharePoint Permissions

1. Ensure the SharePoint list has appropriate permissions:
   - All users need Read access to view the list
   - Users need Contribute access to book leave dates
   - Admins need Full Control access to manage the list

## Step 6: Test and Validate

1. Navigate to your SharePoint page
2. Verify the app loads correctly
3. Test user authentication is working
4. Try booking a leave date
5. Try importing data as an admin

## Troubleshooting Common Issues

1. **App doesn't load**:
   - Check browser console for errors
   - Verify the script paths are correct in the Script Editor
   - Ensure all files were uploaded properly

2. **Authentication issues**:
   - The app should automatically use SharePoint authentication
   - Verify the SharePoint context is loading properly

3. **Data not loading**:
   - Check SharePoint list permissions
   - Verify list column names match exactly

4. **CORS errors**:
   - When using the app within SharePoint, CORS should not be an issue
   - For external access, configure SharePoint to allow cross-origin requests

## Additional Resources

- [SharePoint Framework Documentation](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)
- [SharePoint REST API Reference](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
- [Microsoft 365 Developer Program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
