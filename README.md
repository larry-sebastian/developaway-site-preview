# DevelopAway BAFA Landing Page

## Environment Setup

To deploy this site with the BAFA form functionality, you need to set the following environment variable in your Vercel deployment:

```
HUBSPOT_API_KEY=your-hubspot-api-key
```

## API Routes

- `/api/bafa-lead.js` - Handles BAFA form submissions and creates HubSpot contacts

## Form Features

The BAFA form (Step 3) now uses a custom HTML form that:
- Collects: Vorname, Nachname, E-Mail, Firma
- Submits directly to the Vercel serverless function
- Creates contacts in HubSpot via CRM API
- Shows success/error messages
- Matches the site's dark theme

## Deployment

1. Push to the `main` branch
2. Vercel will automatically deploy
3. Ensure the `HUBSPOT_API_KEY` environment variable is set in Vercel dashboard
4. The form will be available at `/bafa.html#formular`