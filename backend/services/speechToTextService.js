export const speechToTextService = {
    async transcribe(audioBuffer) {
        console.log("Audio buffer received, size:", audioBuffer.length);
        return "This is a placeholder text since we're using the browser's Web Speech API.";
    }
};
