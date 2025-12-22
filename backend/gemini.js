const axios = require("axios");

const GEMINI_URL ="https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent";

const generateResponse=async(prompt)=> {
  const response = await axios.post(
    GEMINI_URL,
    {
      contents: [ {parts:[{ text: prompt }]}]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      }
    }
  );

  return response.data.candidates[0].content.parts[0].text
}

module.exports = generateResponse;
