# Assistant Node

As the title implies, this is an assistant built using nodejs. It uses openAI to perform speech-to-text and answers general questions. It also uses Porcupine from [Picovoice](https://picovoice.ai/) to detect wake word.

Currently this app uses 2 wake words, first wake word is to call openAI and the second wake word is to call and control Home Assistant devices (currently lights and switches are controllable).


### Prerequisites
- An API KEY from Picovoice.
- A wakeword - You can train your wake word within Picovoice and go to Porcupine, or use the Builtin Keyword to activate the wake word. If you train the wake word, you will need to download the `.ppn` file and place it in the project root directory.
- An openai API KEY
- An Long Live API Key from Home Assistant for controlling devices
- The IP address of your Home assistant

### Setup
Clone project, and then install dependencies using `npm install`
Copy the `.env.example` to `.env` using the command 
```
cp .env.example .env
```
Once copied, open the file and fill in the `PORCUPINE_KEY`, `OPENAI_KEY` and the `PORCUPINE_TRAINED_FILE` name.

Once all this is setup, you should be able to start it by simply running
```
node index.js
```
