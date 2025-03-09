import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { registerFactCheckRoutes } from "./routes/factCheckRoutes.js";
import { registerImageProcessingRoutes } from "./routes/imageProcessingRoutes.js";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Register Routes
registerFactCheckRoutes(app);
registerImageProcessingRoutes(app);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
