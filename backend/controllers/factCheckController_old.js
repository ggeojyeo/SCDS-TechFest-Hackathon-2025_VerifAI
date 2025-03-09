import { factCheckService } from "../services/factCheckService.js";
import { speechToTextService } from "../services/speechToTextService.js";

// 🔹 Fact Checking Controller
export const factCheckController = {
    // Process Text Fact-Checking
    async checkFacts(req, res) {
        try {
            const { text } = req.body;
            if (!text) {
                return res.status(400).json({ message: "Text is required" });
            }

            console.log("🔍 Checking Facts for:", text);
            const result = await factCheckService.analyzeText(text);

            return res.status(200).json(result);
        } catch (error) {
            console.error("❌ Error in checkFacts:", error);
            return res.status(500).json({ message: "Error processing request", error: error.message });
        }
    },

    // Process Audio for Fact-Checking
    async processAudio(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No audio file provided" });
            }

            console.log("🔹 Received audio file:", req.file.originalname);

            // Convert Audio to Text (Mocked for now)
            const transcribedText = await speechToTextService.transcribe(req.file.buffer);

            if (!transcribedText) {
                return res.status(422).json({ message: "Could not transcribe the audio" });
            }

            console.log("✅ Transcribed Text:", transcribedText);

            // Perform Fact-Check on Transcribed Text
            const result = await factCheckService.analyzeText(transcribedText);
            console.log("✅ Fact-Check Result:", JSON.stringify(result, null, 2));

            return res.status(200).json(result);
        } catch (error) {
            console.error("❌ Error in processAudio:", error);
            return res.status(500).json({ message: "Error processing request", error: error.message });
        }
    },
};
 