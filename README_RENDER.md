# ReadAloud Pro — Render Deployment

1) Deploy this `server/` folder to Render (Web Service).
2) Env var: ELEVENLABS_API_KEY=your_real_elevenlabs_api_key_here
3) Build: npm install | Start: node server.js
4) Test:
   - GET https://readaloudserver.onrender.com/voices
   - POST https://readaloudserver.onrender.com/speak  (JSON: { "text": "hello" })
