// aissist/server.js
const { askAI } = require("./utils/askAI");

const { startupCheck } = require("./utils/startupCheck");
startupCheck(); // ← run checks before anything

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { convertToWav } = require("./utils/convertAudio");
const { transcribeWithWhisper } = require("./utils/runWhisper");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const wavPath = await convertToWav(file.path);
    const transcript = await transcribeWithWhisper(wavPath);

    fs.unlinkSync(file.path); // remove original upload
    fs.unlinkSync(wavPath);   // remove converted wav

    res.json({ text: transcript });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

app.listen(port, () => {
  console.log(`🧠 AISSIST backend listening at http://localhost:${port}`);
});
