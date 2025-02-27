import recorder from "node-record-lpcm16";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "./src/ai/openai.js";
import { BuiltinKeyword, Porcupine } from "@picovoice/porcupine-node";
import { textToSpeech } from "./tts.js";
import { speechToText } from "./stt.js";
import mqtt from "mqtt";
import "dotenv/config";

const openai = new OpenAI();
const mqttClient = mqtt.connect(`mqtt://172.16.170.50:1883`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioPath = path.join(__dirname, "audio", "audio-file.wav");

const porcupine = new Porcupine(
  process.env.PORCUPINE_KEY,
  [process.env.PORCUPINE_TRAINED_FILE, BuiltinKeyword.GRASSHOPPER],
  [0.5, 0.5],
);

const handleUserCommand = function () {
  const userStream = recorder.record({
    sampleRateHertz: 16000,
    threshold: 0, // No threshold (will always listen)
    silence: 1000, // Stop after 1 second of silence
    verbose: false,
  });

  userStream.stream().pipe(fs.createWriteStream(audioPath));

  setTimeout(async () => {
    userStream.stop();
    const transcription = await speechToText(audioPath);
    const aiResponse = await openai.createChat(transcription);

    await textToSpeech(aiResponse);

    startAssistant();
  }, 4000);
};

function startAssistant() {
  console.log("Listening for wake word...");
  const micStream = recorder.record({
    sampleRateHertz: 16000,
    threshold: 0, // No threshold (will always listen)
    silence: 1000, // Stop after 1 second of silence
    verbose: false,
  });

  let audioBuffer = new Int16Array();
  micStream.stream().on("data", (data) => {
    const audioFrame = new Int16Array(data.buffer);
    audioBuffer = Int16Array.from([...audioBuffer, ...audioFrame]);

    while (audioBuffer.length >= porcupine.frameLength) {
      const frame = audioBuffer.slice(0, porcupine.frameLength);
      audioBuffer = audioBuffer.slice(porcupine.frameLength);

      const keywordIndex = porcupine.process(frame);

      if (keywordIndex !== -1) {
        // Trigger listening for speech
        console.log("Wake word detected!");
        micStream.stop();
      }
      // first keyword is detected
      if (keywordIndex === 0) {
        handleUserCommand();
      }

      // second keyword is detected
      if (keywordIndex === 1) {
      }
    }
  });
}

startAssistant();
