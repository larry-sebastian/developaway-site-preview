// Required environment variable:
// HUBSPOT_API_KEY = your-hubspot-api-key-here

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://developaway.org');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { firstname, lastname, email, company } = req.body;
    
    // Validate required fields
    if (!firstname || !lastname || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstname, lastname, email' 
      });
    }
    
    // Check if HubSpot API key is configured
    if (!process.env.HUBSPOT_API_KEY) {
      console.error('HUBSPOT_API_KEY environment variable not set');
      return res.status(500).json({ 
        error: 'Server configuration error' 
      });
    }
    
    // Create HubSpot contact via CRM API
    const hubspotResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
      },
      body: JSON.stringify({
        properties: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          company: company || '',
          // Add custom properties to track the source
          lifecyclestage: 'lead',
          lead_source: 'BAFA Landing Page',
          hs_lead_status: 'NEW'
        }
      })
    });
    
    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API error:', errorText);
      return res.status(500).json({ 
        error: 'Failed to create contact in HubSpot',
        details: errorText
      });
    }
    
    const hubspotData = await hubspotResponse.json();
    
    return res.status(200).json({ 
      success: true,
      message: 'Contact created successfully',
      contactId: hubspotData.id
    });
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}