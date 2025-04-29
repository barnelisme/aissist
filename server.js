// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { convertToWav } = require("./utils/convertAudio");
const { transcribeWithWhisper } = require("./utils/runWhisper");
const { askAI } = require("./utils/askAI");
const { startupCheck } = require("./utils/startupCheck");
const { getAvailableXraySlots, bookXrayAppointment } = require('./utils/bookXray');

const app = express();
const port = 3001;
startupCheck();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// 🧠 Global conversation memory (temporary, 1 user)
let conversationHistory = [
  {
    role: "system",
    content: `
You are AISSIST, a friendly and patient AI helping people book appointments in New Brunswick hospitals.

- Many users are elderly and not computer literate.
- Always explain in simple, friendly, short sentences.
- If the user wants to book an appointment (like X-ray, bloodwork):
  - First ask which hospital and city they want.
  - Then ask for a preferred date range if needed.
  - Then suggest a few available time slots based on API results.
  - Confirm clearly before booking.
- Remind users that bookings are online at https://horizonnb.ca/patients-visitors/self-booking-options-at-horizon/ if needed.
- Never use complicated or technical words.
- Stay positive and encouraging.
`.trim()
  }
];

// 🔊 Main endpoint: record → whisper → GPT → respond
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const wavPath = await convertToWav(file.path);
    const transcript = await transcribeWithWhisper(wavPath);
    console.log("📝 Transcript:", transcript);

    // ➡️ Save user message
    conversationHistory.push({ role: "user", content: transcript });

    // ➡️ Send full conversation
    const aiResponse = await askAI(conversationHistory);

    // ➡️ Save AI response
    conversationHistory.push({ role: "assistant", content: aiResponse });

    fs.unlinkSync(file.path);
    fs.unlinkSync(wavPath);

    res.json({ text: aiResponse });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe or reply" });
  }
});

// Fetch available slots
app.get('/api/xray-slots', async (req, res) => {
  const { preferredDate } = req.query;
  try {
    const slots = await getAvailableXraySlots({ preferredDate });
    res.json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});

// Book appointment
app.post('/api/book-xray', async (req, res) => {
  const { patientName, slot, location, serviceType } = req.body;
  try {
    const result = await bookXrayAppointment({ patientName, slot, location, serviceType });
    res.json(result);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

app.listen(port, () => {
  console.log(`🧠 AISSIST backend listening at http://localhost:${port}`);
});
