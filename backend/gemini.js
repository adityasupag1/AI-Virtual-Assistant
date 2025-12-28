const axios = require("axios");

const ALLOWED_TYPES = new Set([
  "general",
  "google_search",
  "youtube_search",
  "youtube_play",
  "get_time",
  "get_date",
  "get_day",
  "get_month",
  "calculator_open",
  "instagram_open",
  "facebook_open",
  "weather_show"
]);

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

module.exports = async function generateResponse(
  command,
  assistantName,
  userName
) {
  const apiUrl = process.env.GEMINI_URL;

  const systemPrompt = `
You are a virtual voice-enabled assistant named ${assistantName}, created by ${userName}.
You are NOT Google.
 
Your job is to understand the user's intent and respond ONLY with a valid JSON object.
Do NOT add explanations, markdown, or extra text.

Respond ONLY with a valid JSON object.

JSON format(strict):
{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
          "get_time" | "get_date" | "get_day" | "get_month" |
          "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",

  "userinput": "original user sentence",
  "response": "short, voice-friendly reply"
}

Type meanings:
- "general": if it's a factual or informational question.
- "google_search": if user wants to search something on Google.
- "youtube_search": if user wants to search something on YouTube.
- "youtube_play": if user wants to directly play a video or song.
- "calculator_open": if user wants to open a calculator.
- "instagram_open": if user wants to open instagram.
- "facebook_open": if user wants to open facebook.
- "weather_show": if user wants to know weather.
- "get_time": if user asks for current time.
- "get_date": if user asks for today's date.
- "get_day": if user asks what day it is.
- "get_month": if user asks for the current month.


Important rules: 
- If user asks who created you, reply using "${userName}" 
- Output ONLY valid JSON
`;

  const finalPrompt = `${systemPrompt}\nUser input: ${command}`;

  try {
    const geminiRes = await axios.post(
      apiUrl,
      {
        contents: [{ parts: [{ text: finalPrompt }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        timeout: 10000
      }
    );

    const text =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    const parsed = safeJsonParse(text);

    if (
      parsed &&
      ALLOWED_TYPES.has(parsed.type) &&
      typeof parsed.response === "string"
    ) {
      return {
        type: parsed.type,
        userInput: parsed.userinput || command,
        response: parsed.response
      };
    }

    // fallback if Gemini returns weird JSON
    return {
      type: "general",
      userInput: command,
      response: "I'm not sure how to help with that."
    };

  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);

    return {
      type: "general",
      userInput: command,
      response: "I'm having trouble responding right now."
    };
  }
};
