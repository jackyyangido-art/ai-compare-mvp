import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { processWithStability } from "./providers/stability.js";
import { processWithReplicate } from "./providers/replicate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/api/compare", upload.single("image"), async (req, res) => {
  try {
    const { prompt, provider } = req.body;
    let resultUrl;

    if (provider === "stability") {
      resultUrl = await processWithStability(req.file.path, prompt);
    } else if (provider === "replicate") {
      resultUrl = await processWithReplicate(req.file.path, prompt);
    } else {
      throw new Error("Unknown provider");
    }

    res.json({ resultUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
