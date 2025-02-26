import { OpenAI as OpenAILib } from "openai";
import "dotenv/config";

const MAX_HISTORY = 10;

export class OpenAI {
  openAI = null;
  chatHistory = [];

  constructor(apiKey) {
    if (!this.openAI) {
      this.openAI = new OpenAILib({ apiKey: process.env.OPENAI_KEY });
    }
  }

  async createChat(text) {
    this.chatHistory.push({ role: "user", content: text });

    if (this.chatHistory.length > MAX_HISTORY) {
      this.chatHistory.shift();
    }
    console.log("chathistory: ", this.chatHistory);
    const response = await this.openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: this.chatHistory,
    });

    const aiResponse = response.choices[0].message.content;
    this.chatHistory.push({ role: "assistant", content: aiResponse });

    return aiResponse;
  }

  async textToSpeech(text) {
    return this.openAI.audio.speech.create({
      model: "tts-1",
      input: text,
      voice: "alloy",
    });
  }
}
