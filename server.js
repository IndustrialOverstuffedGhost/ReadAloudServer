import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;


const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const PORT = process.env.PORT || 10000;


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
	
	// Optional browser-friendly fallback
app.get("/speak", (req, res) => {
  res.status(200).json({
    message: "👋 This endpoint only supports POST.",
    usage: {
      method: "POST",
      url: "/speak",
      body: { text: "Your text to read", voice_id: "optional voice_id" }
    }
  });
});
	
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    const buf = Buffer.from(await r.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Optional browser-friendly fallback
app.get("/speak", (req, res) => {
  res.status(200).json({
    message: "👋 This endpoint only supports POST.",
    usage: {
      method: "POST",
      url: "/speak",
      body: { text: "Your text to read", voice_id: "optional voice_id" }
    }
  });
});

// ✅ Confirm API key loaded
if (ELEVEN_API_KEY) {
  console.log("✅ ElevenLabs API key loaded, prefix:", ELEVEN_API_KEY.substring(0, 8) + "...");
} else {
  console.log("❌ ELEVENLABS_API_KEY not found. Check Render Environment settings.");
}

// Keep-alive ping
setInterval(async () => {
  try {
    await fetch("https://readaloudserver.onrender.com/");
    console.log("Keepalive ping OK");
  } catch (e) {
    console.log("Keepalive failed:", e.message);
  }
}, 9 * 60 * 1000);

app.listen(PORT, () => console.log(`✅ ReadAloud server running on ${PORT}`));


setInterval(async () => {
  try {
    await fetch("https://readaloudserver.onrender.com/");
    console.log("Keepalive ping OK");
  } catch (e) {
    console.log("Keepalive ping failed:", e.message);
  }
}, 9 * 60 * 1000);

app.listen(PORT, () => console.log(`✅ ReadAloud server running on ${PORT}`));