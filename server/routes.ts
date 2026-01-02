import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import multer from "multer";
import sharp from "sharp";
import { GoogleGenAI, Modality } from "@google/genai";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const AMAZON_MAIN_PROMPT = `Edit this product photo for an Amazon main listing image.
- Keep the product EXACTLY the same (do not repaint, retouch, change colors, patterns, logos, labels, or shape).
- Remove the entire background (including table/clutter) completely.
- Place the product on a pure white background (RGB 255,255,255).
- Keep edges clean with no halos or fringing.
- Center the product and scale it so it fills about 85% of a square frame with safe margins.
- Output a square image, photorealistic, no text, no watermark, no borders.`;

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.post(
    "/api/amazon-main",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No image file provided" });
        }

        if (
          !process.env.AI_INTEGRATIONS_GEMINI_API_KEY ||
          !process.env.AI_INTEGRATIONS_GEMINI_BASE_URL
        ) {
          return res.status(500).json({
            error:
              "Gemini AI integration is not configured. Please set up the AI integration.",
          });
        }

        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString("base64");
        const mimeType = req.file.mimetype || "image/jpeg";

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                  },
                },
                { text: AMAZON_MAIN_PROMPT },
              ],
            },
          ],
          config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
          },
        });

        const candidate = response.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find(
          (part: { inlineData?: { data?: string; mimeType?: string } }) =>
            part.inlineData
        );

        if (!imagePart?.inlineData?.data) {
          return res.status(500).json({
            error: "AI did not return an image. Please try again.",
          });
        }

        const generatedImageBuffer = Buffer.from(
          imagePart.inlineData.data,
          "base64"
        );

        let processedBuffer = await sharp(generatedImageBuffer)
          .resize(2000, 2000, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255 },
          })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 95 })
          .toBuffer();

        const { data, info } = await sharp(processedBuffer)
          .raw()
          .toBuffer({ resolveWithObject: true });

        const pixels = new Uint8Array(data);
        const width = info.width;
        const height = info.height;
        const channels = info.channels;

        for (let i = 0; i < pixels.length; i += channels) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          if (r >= 250 && g >= 250 && b >= 250) {
            pixels[i] = 255;
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
          }
        }

        const finalBuffer = await sharp(Buffer.from(pixels), {
          raw: { width, height, channels },
        })
          .jpeg({ quality: 95 })
          .toBuffer();

        res.set("Content-Type", "image/jpeg");
        res.set(
          "Content-Disposition",
          'attachment; filename="amazon-main.jpg"'
        );
        res.send(finalBuffer);
      } catch (error) {
        console.error("Error processing image:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
          error: `Failed to process image: ${errorMessage}`,
        });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}