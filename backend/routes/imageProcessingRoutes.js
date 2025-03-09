import express from "express";
import { imageProcessingController } from "../controllers/imageProcessingController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Image Processing API
router.post("/api/tvbd", upload.single("file"), imageProcessingController.processImage);

export function registerImageProcessingRoutes(app) {
    app.use(router);
}
