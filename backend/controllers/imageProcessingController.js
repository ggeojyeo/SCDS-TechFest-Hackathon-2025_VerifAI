import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { exec } from "child_process";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Load API Key from Environment
const GOOGLE_FACT_CHECK_API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY;

if (!GOOGLE_FACT_CHECK_API_KEY) {
    console.error("❌ GOOGLE_FACT_CHECK_API_KEY is missing!");
    process.exit(1); // Stop execution if no API key
}

// 🔹 Function to Call Google Fact Check API
async function checkFact(text) {
    try {
        const shortenedText = text.split(".")[0].slice(0, 50);
        console.log("Fact Checking Query:", shortenedText);

        const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(shortenedText)}&key=${GOOGLE_FACT_CHECK_API_KEY}`;

        console.log("🔹 Sending API Request to:", url);
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.claims) {
            console.log("⚠️ No fact-check results found.");
        }

        return data.claims || [];
    } catch (error) {
        console.error("Fact Check API Error:", error);
        return [];
    }
}

// 🔹 Image Processing Controller
export const imageProcessingController = {
    async processImage(req, res) {
        try {
            console.log("📥 Request received!");
            console.log("📂 Received File:", req.file);

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            console.log("✅ Processing image upload...");

            // Save uploaded image
            const uploadDir = "/tmp";
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${randomUUID()}.png`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, req.file.buffer);
            console.log("✅ Image saved at:", filePath);

            // Run OCR Script
            const scriptPath = path.join(__dirname, "../scripts/google-ocr.js");

            exec(`node "${scriptPath}" "${filePath}"`, async (error, stdout, stderr) => {
                if (error) {
                    console.error("❌ OCR Error:", stderr);
                    return res.status(500).json({ error: "OCR process failed", details: stderr });
                }

                console.log("✅ OCR Output:", stdout);

                try {
                    const result = JSON.parse(stdout.trim());
                    const extractedText = result.text || "";

                    if (!extractedText) {
                        return res.status(500).json({ error: "OCR output is empty" });
                    }

                    console.log("🔹 Extracted Text:", extractedText);

                    // Perform Fact Check
                    const factCheckResults = await checkFact(extractedText);
                    console.log("✅ Fact Check API Response:", JSON.stringify(factCheckResults, null, 2));

                    return res.json({
                        extractedText,
                        factCheckResults,
                    });

                } catch (parseError) {
                    console.error("❌ Failed to parse OCR output:", stdout);
                    return res.status(500).json({ error: "Invalid OCR output", details: stdout });
                }
            });

        } catch (error) {
            console.error("❌ API Error:", error);
            return res.status(500).json({ error: "Internal server error", details: error.message });
        }
    }
};
