import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import https from "https";
import dotenv from "dotenv";

dotenv.config();
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// persistent HTTPS session for faster TLS handshakes
const agent = new https.Agent({ keepAlive: true });

/**
 * Simple in-memory cache (1 minute) to prevent re-generation
 */
const cache = new Map();
function cacheKey(text, voice) {
  return `${voice}:${text.trim().slice(0, 300)}`;
}
function pruneCache() {
  const now = Date.now();
  for (const [k, v] of cache) if (now - v.time > 60_000) cache.delete(k);
}
setInterval(pruneCache, 30_000);

/**
 * Stream ElevenLabs voice data to the browser
 */
app.get("/speak", async (req, res) => {
  const text = req.query.text || "";
  const voice = req.query.voice_id || "EXAVITQu4vr4xnSDxMaL";
  if (!text) return res.status(400).json({ error: "missing text" });

  const key = cacheKey(text, voice);
  if (cache.has(key)) {
    console.log("⚡ Cache hit");
    const cached = cache.get(key);
    res.setHeader("Content-Type", "audio/mpeg");
    cached.data.pipe(res);
    return;
  }

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.6, similarity_boost: 0.8 },
        }),
        agent,
      }
    );

    if (!r.ok) {
      const err = await r.text();
      console.error("ElevenLabs error:", err);
      return res.status(r.status).send(err);
    }

    res.setHeader("Content-Type", "audio/mpeg");
    // store a tee’d copy in cache while streaming to user
    const { PassThrough } = await import("stream");
    const clone = new PassThrough();
    r.body.pipe(clone);
    cache.set(key, { data: clone, time: Date.now() });
    r.body.pipe(res);
  } catch (err) {
    console.error("Speak error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Voices endpoint
 */
app.get("/voices", async (req, res) => {
  try {
    const r = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": ELEVEN_API_KEY },
      agent,
    });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to load voices" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`✅ Optimized server running on port ${PORT}`)
);
