# Cell Assembly Traceability App

A mobile-friendly web application for tracking battery cell assembly in manufacturing plants. This temporary solution provides traceability features until the full MES system is deployed.

## Features

- PIN-based authentication
- QR/DMC code scanning using device camera
- Parameter entry (voltage, temperature, notes)
- Data submission to Google Apps Script endpoint
- Mobile-responsive design

## Setup

1. Clone the repository
2. Open `app.js` and configure:
   - Set your desired PIN in the `CONFIG.PIN` property
   - Add your Google Apps Script Web App URL to `CONFIG.GOOGLE_SCRIPT_URL`

## Deployment

The app can be deployed on Vercel:
1. Push the code to GitHub
2. Create a new project on Vercel
3. Connect to your GitHub repository
4. Deploy

## Usage

1. Enter the configured PIN to access the app
2. Use the device's camera to scan QR/DMC codes
3. Enter the required parameters
4. Submit the data

## Security Notes

- PIN is stored in localStorage for convenience
- Consider implementing server-side PIN validation for better security
- Use HTTPS for secure data transmission

## License

MIT License 