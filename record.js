import recorder from "node-record-lpcm16";
//const { transcribeAudio } = require("./transcribe.js");
import fs from "fs";
import path from "path";

export const recordAudio = () => {
  // Start recording after wake word
  const micStream = recorder.record({
    sampleRateHertz: 16000,
    threshold: 0, // No threshold (will always listen)
    silence: 1000, // Stop after 1 second of silence
    verbose: false,
  });
  //micStream
  //.stream()
  //.pipe(fs.createWriteSteam(path.join(__dirname, "audio", "audio-file.wav")));
  //console.log("Recording...");

  //return micStream

  micStream.stream().on("data", (data) => {
    // Send audio data to STT function for processing
    //transcribeAudio(data);
    const audioFrame = new Int16Array(data.buffer);
    const result = porcupine.process(audioFrame);
    if (result !== -1) {
      console.log("Wake word detected!");
      micStream.stop();
    }
  });
};
