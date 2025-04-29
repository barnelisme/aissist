// utils/startupCheck.js
const fs = require("fs");
const path = require("path");

function startupCheck() {
  console.log("🧹 Running startup checks...");

  // Check uploads folder
  const uploadsPath = path.resolve(__dirname, "../uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    console.log("✅ Created 'uploads/' folder.");
  } else {
    console.log("✅ 'uploads/' folder exists.");
  }

  // Check whisper binary
  const whisperPath = path.resolve(__dirname, "../../whisper.cpp/build/bin/main");
  if (!fs.existsSync(whisperPath)) {
    console.error("❌ Error: whisper.cpp 'main' binary missing at", whisperPath);
    process.exit(1);
  } else {
    console.log("✅ whisper.cpp 'main' binary found.");
  }

  // Check model
  const modelPath = path.resolve(__dirname, "../../whisper.cpp/models/ggml-tiny.en.bin");
  if (!fs.existsSync(modelPath)) {
    console.error("❌ Error: Whisper model file missing at", modelPath);
    process.exit(1);
  } else {
    console.log("✅ Whisper model file found.");
  }

  // Check utility functions
  try {
    const { convertToWav } = require("./convertAudio");
    const { transcribeWithWhisper } = require("./runWhisper");
    if (typeof convertToWav !== "function" || typeof transcribeWithWhisper !== "function") {
      console.error("❌ Error: Utility functions missing or incorrectly exported.");
      process.exit(1);
    } else {
      console.log("✅ Utility functions available.");
    }
  } catch (err) {
    console.error("❌ Error importing utilities:", err.message);
    process.exit(1);
  }

  console.log("✅ Startup checks passed.\n");
}

module.exports = { startupCheck };
