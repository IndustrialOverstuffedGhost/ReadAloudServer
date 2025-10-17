// ===============================
// ReadAloud Pro Render Server (ESM)
// ===============================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Environment variables
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const PORT = process.env.PORT || 10000;

const app = express();
app.use(cors());
app.use(express.json());

// Confirm API key loaded
if (ELEVEN_API_KEY) {
  console.log("✅ ElevenLabs API key loaded, prefix:", ELEVEN_API_KEY.substring(0, 8) + "...");
} else {
  console.log("❌ ELEVENLABS_API_KEY not found. Check Render Environment settings.");
}

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "ReadAloud Pro ElevenLabs Server is running ✅" });
});

// Fetch voices
app.get("/voices", async (req, res) => {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": ELEVEN_API_KEY },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Voices error:", response.status, text);
      return res.status(response.status).json({ error: "Voices fetch failed", details: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Voices fetch exception:", err);
    res.status(500).json({ error: "Voices fetch exception", details: err.message });
  }
});

// Speak (POST only)
app.post("/speak", async (req, res) => {
  const { text, voice_id = "EXAVITQu4vr4xnSDxMaL" } = req.body || {};

  if (!text) return res.status(400).json({ error: "Missing text input" });

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Speak error:", response.status, errText);
      return res.status(response.status).json({ error: "Speak failed", details: errText });
    }

    const audioBuffer = await response.arrayBuffer();
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="speech.mp3"',
    });
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("Speak exception:", err);
    res.status(500).json({ error: "Speak exception", details: err.message });
  }
});

// Browser-friendly fallback for GET /speak
app.get("/speak", (req, res) => {
  res.status(200).json({
    message: "👋 This endpoint only supports POST.",
    usage: {
      method: "POST",
      url: "/speak",
      body: { text: "Your text to read", voice_id: "optional voice_id" },
    },
  });
});

// Keepalive ping
setInterval(async () => {
  try {
    await fetch("https://readaloudserver.onrender.com/");
    console.log("Keepalive ping OK");
  } catch (e) {
    console.log("Keepalive failed:", e.message);
  }
}, 9 * 60 * 1000);

// Start server
app.listen(PORT, () => console.log(`✅ ReadAloud server running on ${PORT}`));
