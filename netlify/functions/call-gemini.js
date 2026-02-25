// File: netlify/functions/call-gemini.js

exports.handler = async function (event) {
  // Get the user's prompt from the request made by the front-end
  const { prompt } = JSON.parse(event.body);

  // Securely access the API key from Netlify's environment variables
  const API_KEY = process.env.GEMINI_API_KEY; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // If Google's API returns an error, send it back to the front-end
      const errorData = await response.json();
      return { statusCode: response.status, body: JSON.stringify(errorData) };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result) // Send the successful result back to the front-end
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "There was an issue contacting the Gemini API." })
    };
  }
};
