const express = require("express");
const cors = require("cors");
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

let conversationHistory = [];

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const wavPath = await convertToWav(file.path);
    const { text, language } = await transcribeWithWhisper(wavPath);

    console.log("📝 Transcript:", text);
    console.log("🌍 Detected language:", language);

    // Only use the text for GPT
    conversationHistory.push({ role: "user", content: text });

    // Pass detected language to GPT
    const aiResponse = await askAI(conversationHistory, language);

    conversationHistory.push({ role: "assistant", content: aiResponse });

    fs.unlinkSync(file.path);
    fs.unlinkSync(wavPath);

    res.json({ text: aiResponse, language });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe or reply" });
  }
});

app.listen(port, () => {
  console.log(`🧠 AISSIST backend listening at http://localhost:${port}`);
});
