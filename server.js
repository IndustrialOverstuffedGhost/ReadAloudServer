import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => res.json({ status: "✅ Server running" }));

app.post("/api/elevenlabs", async (req, res) => {
  try {
    const { text, voiceId = "21m00Tcm4TlvDq8ikWAM" } = req.body;
    const r = await fetch(https://api.elevenlabs.io/v1/text-to-speech/, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.6, similarity_boost: 0.8 }
      })
    });
    if (!r.ok) throw new Error(ElevenLabs: );
    const audio = Buffer.from(await r.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(✅ ElevenLabs server running on ));
