
# Essential Files for SharePoint Deployment

When deploying your Leave Date Manager to SharePoint, you need to focus on these key files:

## Core Application Files
These files must be uploaded to your SharePoint Site Assets or App Package:

1. `index.html` - The main HTML entry point
2. `main.js` (or similar) - The bundled JavaScript file
3. `style.css` (or similar) - The bundled CSS styles
4. Any other assets in your build directory (images, fonts, etc.)

## Source Code Files (For Maintenance)
Keep these files in your source repository:

1. `src/context/SharePointContext.tsx` - Handles SharePoint authentication
2. `src/utils/sharePointApi.ts` - Contains SharePoint API integration
3. `src/utils/dateUtils.ts` - Date manipulation utilities
4. `src/components/AdminPanel.tsx` - Admin functionality for importing data
5. `src/components/LeaveBooking.tsx` - Main booking interface
6. `src/components/Calendar.tsx` - Calendar display component
7. `src/pages/Index.tsx` - Main application page
8. `src/App.tsx` - Application routing and providers

## Configuration Files
These files control application behavior:

1. `SharePoint_Deployment_Guide.md` - Deployment instructions
2. `vite.config.ts` - Build configuration
3. `tsconfig.json` - TypeScript configuration

## Build Process

To generate the deployable files:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The output in the 'dist' directory is what you upload to SharePoint
```

## SharePoint List Structure

Create a SharePoint list named "LeaveDates" with these columns:
- Title (default, can be used for notes)
- Date (Date and Time)
- MaxSlots (Number)
- BookedSlots (Number)
- BookedBy (Multiple lines of text)

This list will store all your leave date data and bookings.
