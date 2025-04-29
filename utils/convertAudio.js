const { exec } = require("child_process");
const path = require("path");

function convertToWav(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath + ".wav";

    // Force correct encoding: 16kHz, mono, PCM signed 16-bit little endian
    const cmd = `ffmpeg -y -i ${inputPath} -ar 16000 -ac 1 -acodec pcm_s16le ${outputPath}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("FFmpeg error:", stderr);
        return reject(error);
      }
      resolve(outputPath);
    });
  });
}

module.exports = { convertToWav };
