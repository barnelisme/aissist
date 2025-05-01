const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function transcribeWithWhisper(wavPath) {
  return new Promise((resolve, reject) => {
    const whisperPath = path.resolve(__dirname, "../../whisper.cpp/build/bin/whisper-cli");
    const modelPath = path.resolve(__dirname, "../../whisper.cpp/models/ggml-base.bin");

    const cmd = `${whisperPath} -m ${modelPath} -f ${wavPath} -otxt --language auto`;

    console.log("▶️ Running command:", cmd);

    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      if (err) {
        console.error("Whisper stderr:\n", stderr || "(none)");
        return reject(err);
      }

      const txtFile = wavPath + ".txt";
      if (!fs.existsSync(txtFile)) return reject(new Error("Transcript file missing"));

      const text = fs.readFileSync(txtFile, "utf8").trim();

      // 🧠 Basic check for common French words to override bad detection
      const frenchKeywords = ["bonjour", "hôpital", "réserver", "aide", "je", "vous", "nom", "s’il vous plaît"];
      const isLikelyFrench = frenchKeywords.some(word => text.toLowerCase().includes(word));

      const detectedLang = isLikelyFrench ? "fr" : "en";

      fs.unlinkSync(txtFile);
      resolve({ text, language: detectedLang });
    });
  });
}

module.exports = { transcribeWithWhisper };
