const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function transcribeWithWhisper(wavPath) {
  return new Promise((resolve, reject) => {
    const whisperPath = path.resolve(__dirname, "../../whisper.cpp/build/bin/whisper-cli");
    const modelPath = path.resolve(__dirname, "../../whisper.cpp/models/ggml-tiny.en.bin");

    const cmd = `${whisperPath} -m ${modelPath} -f ${wavPath} -otxt`;

    console.log("▶️ Running command:", cmd);

    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      if (err) {
        console.error("Whisper stderr:\n", stderr || "(none)");
        return reject(err);
      }

      const txtFile = wavPath + ".txt";
      if (!fs.existsSync(txtFile)) return reject(new Error("Transcript file missing"));

      const text = fs.readFileSync(txtFile, "utf8").trim();
      fs.unlinkSync(txtFile);
      resolve(text);
    });
  });
}

module.exports = { transcribeWithWhisper };
