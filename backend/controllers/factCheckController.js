import { factCheckService } from "../services/factCheckService.js";

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
    }
};
