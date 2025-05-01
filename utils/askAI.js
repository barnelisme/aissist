const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getSystemMessage(language) {
  return {
    role: "system",
    content: `
You are AISSIST, a helpful assistant for hospital bookings in New Brunswick.

- Keep replies simple, clear and friendly.
- Respond in the same language as the user (${language.toUpperCase()}).
- If the user speaks another language, ask them to speak English or French.
- If they want to book an appointment, ask:
  - First name and last name (confirm spelling),
  - Then hospital and city,
  - Then preferred date range,
  - Then suggest slots (if available).
- Confirm before booking.
- Be friendly, do not rush.
`.trim()
  };
}

async function askAI(conversationHistory, language = "en") {
  const systemMessage = getSystemMessage(language);
  const fullMessages = [systemMessage, ...conversationHistory];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: fullMessages,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { askAI };
