import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app) {
    const vite = await createViteServer({
        server: { middlewareMode: true },
    });

    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
        try {
            const template = await fs.promises.readFile(path.resolve(__dirname, "../client/index.html"), "utf-8");
            res.status(200).set({ "Content-Type": "text/html" }).end(await vite.transformIndexHtml(req.originalUrl, template));
        } catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });
}
