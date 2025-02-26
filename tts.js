import fs from "fs";
import "dotenv/config";
import { OpenAI } from "./src/ai/openai.js";
import player from "play-sound";

const speechPlayer = player({});

const openai = new OpenAI();

export async function textToSpeech(text) {
  const response = await openai.textToSpeech(text);

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const audioFile = "output.mp3";
  fs.writeFileSync(audioFile, audioBuffer);

  speechPlayer.play(audioFile, (err) => {
    if (err) {
      console.error("Unable to play audio: ", err);
    }
  });
}
