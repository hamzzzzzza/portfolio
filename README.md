# Portfolio App

A Vite + React portfolio site with a Gemini-powered AI assistant feature.

## Local setup

1. Copy `.env.example` to `.env`
2. Add your Google Gemini API key as `VITE_GEMINI_API_KEY`
3. Run `npm install`
4. Run `npm run dev`

## Notes

The AI assistant and pitch generator are disabled until a valid `VITE_GEMINI_API_KEY` is configured. Without it, the app will show a clear message instead of sending an empty request to the API.
