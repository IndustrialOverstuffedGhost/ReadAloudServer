import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
app.get("/", (req, res) => res.json({ status: "ok" }));

app.post("/speak", async (req, res) => {
  try {
    const { text, voice_id = "EXAVITQu4vr4xnSDxMaL" } = req.body;
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error: ${errText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

