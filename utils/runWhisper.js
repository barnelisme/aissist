const whisperPath = path.resolve(__dirname, "../../whisper.cpp/build/bin/main");
const modelPath = path.resolve(__dirname, "../../whisper.cpp/models/ggml-tiny.en.bin");

const cmd = `${whisperPath} -m ${modelPath} -f ${wavPath} -otxt`;
