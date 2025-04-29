// utils/askAI.js
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Always define the system message
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are AISSIST, a friendly and patient AI helping people book appointments in New Brunswick hospitals.

- Many users are elderly and not computer literate.
- Always explain in simple, friendly, short sentences.
- If the user wants to book an appointment (like X-ray, bloodwork):
  - First get the user's first name and last name, ensure the speeling is correct.
  - Then ask which hospital and city they want.
  - Then ask for a preferred date range if needed.
  - Then suggest a few available time slots based on API results.
  - Confirm clearly before booking.
- Remind users that bookings are online at https://horizonnb.ca/patients-visitors/self-booking-options-at-horizon/ if needed.
- Never use complicated or technical words.
- Stay positive and encouraging.
  `.trim()
};

/**
 * askAI - Sends full conversation to GPT
 * @param {Array} conversationHistory - Array of { role, content }
 */
async function askAI(conversationHistory) {
  // Always make sure system message is at the beginning
  const fullConversation = [SYSTEM_MESSAGE, ...conversationHistory];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: fullConversation,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { askAI };
