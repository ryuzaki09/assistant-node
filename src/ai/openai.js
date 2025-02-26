import { OpenAI as OpenAILib } from "openai";
import "dotenv/config";

export class OpenAI {
  openAI;

  constructor(apiKey) {
    if (!this.openAI) {
      this.openAI = new OpenAILib({ apiKey: process.env.OPENAI_KEY });
    }
  }

  async createChat(text) {
    const response = await this.openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
    });

    return response.choices[0].message.content;
  }

  async textToSpeech(text) {
    return this.openAI.audio.speech.create({
      model: "tts-1",
      input: text,
      voice: "alloy",
    });
  }
}
