import express from "express";
import { factCheckController } from "../controllers/factCheckController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Fact Check API for Text & Audio
router.post("/api/factcheck", factCheckController.checkFacts);
router.post("/api/factcheck/audio", upload.single("audio"), factCheckController.processAudio);

export function registerFactCheckRoutes(app) {
    app.use(router);
}
