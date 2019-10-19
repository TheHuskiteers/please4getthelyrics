# HackUMass-VII
Real-time speech to text translation via microphone input and Google Cloud Speech to Text API

## About
This project uses the Google Cloud Speech to Text API to translate speech from a micophone input to text. Audio is streamed from the users microphone input into the Google Cloud Speech to Text API, allowing text to be generated in real time. Once the text is generated and determined, the output gets written to ---, to be read by ---

## Requirements
Install requirements via Terminal:
`npm install node-record-lpcm16`
`npm install @google-cloud/speech`

## Running
Make sure directory is set to folder enclosing file (via `cd Speech-to-Text` or similar), then run `node speech-to-text.js`