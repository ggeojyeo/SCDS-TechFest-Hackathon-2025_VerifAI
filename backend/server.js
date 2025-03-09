import dotenv from "dotenv"; // ✅ Use ES Module import
dotenv.config({ path: ".env.local" }); // ✅ Explicitly load .env.local
import express from "express";
import cors from "cors";
import multer from "multer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Fix for __dirname
import { randomUUID } from "crypto";
import { exec } from "child_process";
import fetch from "node-fetch"; // ✅ Use ES Module import
import { log } from "console";

// 🔹 Define __dirname manually (fixes ES module issue)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Ensure form data is parsed

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Google Fact Check API Key (Stored in .env.local)
const GOOGLE_FACT_CHECK_API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY || "";

// Function to call Google Fact Check API
async function checkFact(text) {
    try {

        const shortenedText = text.split(".")[0].slice(0, 50);
        console.log("Fact Checking Query:", shortenedText);

        const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(shortenedText)}&key=${GOOGLE_FACT_CHECK_API_KEY}`;

        console.log("🔹 Sending API Request to:", url); // Debugging log

        const response = await fetch(url);
        const data = await response.json();
        return data.claims || [];
    } catch (error) {
        console.error("Fact Check API Error:", error);
        return [];
    }
}

// 🔹 API Endpoint to Handle Image Upload & OCR Processing
app.post("/api/tvbd", upload.single("file"), async (req, res) => {
    try {
        console.log("📥 Request received!");
        console.log("🔍 Request Headers:", req.headers);
        console.log("📝 Request Body:", req.body);
        console.log("📂 Received File:", req.file);

        if (!req.file) {
            console.error("❌ No file uploaded");
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("✅ File received:", req.file.originalname);

        console.log("✅ Processing image upload...");

        // Save uploaded image to /tmp/
        const uploadDir = "/tmp";
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${randomUUID()}.png`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, req.file.buffer);
        console.log("✅ Image saved at:", filePath);

        // Fix for __dirname issue
        const scriptPath = path.join(__dirname, "scripts", "google-ocr.js");

        console.log("🔹 Running OCR script at:", scriptPath);

        exec(`node "${scriptPath}" "${filePath}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error("❌ OCR Error:", stderr);
                return res.status(500).json({ error: "OCR process failed", details: stderr });
            }

            console.log("✅ Raw OCR Output:", stdout);

            try {
                const result = JSON.parse(stdout.trim());
                const extractedText = result.text || "";

                if (!extractedText) {
                    console.error("❌ OCR extracted text is empty");
                    return res.status(500).json({ error: "OCR output is empty" });
                }

                console.log("🔹 Extracted Text:", extractedText);

                // 🔹 Call Fact Check API
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
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
