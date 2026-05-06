export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model, max_tokens, apiKey } = req.body;

    // Validate input
    if (!apiKey || !messages || !model) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call Anthropic API from server (no CORS issues here)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: max_tokens || 2000,
        messages: messages
      })
    });

    const data = await response.json();

    // If API returned an error, pass it back
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Success - return the response
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
