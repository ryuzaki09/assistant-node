import { OpenAI } from "openai";
import "dotenv/config";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const speechToText = async (audioFilePath) => {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: "whisper-1",
  });
  return response.text;
};
