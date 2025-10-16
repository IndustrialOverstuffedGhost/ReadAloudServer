import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;

app.get("/", (req, res) => res.json({ status: "ok" }));

app.get("/voices", async (req, res) => {
  try {
    const r = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": ELEVEN_API_KEY }
    });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/speak", async (req, res) => {
  try {
    const { text, voice_id = "EXAVITQu4vr4xnSDxMaL" } = req.body || {};
    if (!text) return res.status(400).json({ error: "Missing text" });
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.6, similarity_boost: 0.8 }
      })
    });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    const buf = Buffer.from(await r.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

setInterval(async () => {
  try {
    await fetch("https://readaloudserver.onrender.com/");
    console.log("Keepalive ping OK");
  } catch (e) {
    console.log("Keepalive ping failed:", e.message);
  }
}, 9 * 60 * 1000);

app.listen(PORT, () => console.log(`✅ ReadAloud server running on ${PORT}`));