# 🗣️ ReadAloud Pro ElevenLabs Render Server

## 🚀 Quick Deploy
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Manual Steps
1. Push this folder to a GitHub repo.
2. Go to [Render.com](https://render.com) → **New + Web Service**.
3. Connect your repo.
4. Add the following environment variable in Render:
   - \ELEVENLABS_API_KEY\ = your ElevenLabs key
5. Deploy and get a live URL like:
   \https://render-server.onrender.com/api/elevenlabs\

### 🧠 Local Run
\\\ash
npm install
cp .env.example .env
# Edit .env and add your ElevenLabs API key
npm start
\\\
Visit [http://localhost:10000](http://localhost:10000)
