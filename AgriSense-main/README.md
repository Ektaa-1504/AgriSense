# AgriSense

AgriSense is an AI-powered agricultural assistant built for farmers and field officers. It combines real-time weather intelligence, crop disease detection, farm advisory chat, and officer management tools into one responsive web app.

## What this project does

- Provides a **smart AI chat assistant** for agricultural support and farmer queries.
- Supports **Malayalam and English** through a multilingual UI.
- Detects **plant diseases** from images or camera input and suggests remedies.
- Delivers **weather-aware farming advice** using OpenWeatherMap.
- Offers a **dashboard for agricultural officers** to manage queries and support farmers.
- Uses **MongoDB** for data storage and **Socket.io** for real-time interactions.

## Project structure

- `backend/` — Express.js API server, authentication, AI services, weather services, crop info, and officer query handling.
- `frontend/` — React + Vite frontend, user interface, dashboard, login/signup, chat, and disease detection.

## Key features

- AI-powered recommendations based on weather, crop type, and disease status.
- Real-time chat and query updates with Socket.io.
- Plant disease detection with image upload and camera support.
- Malayalam language support and localized agricultural guidance.
- Officer login, dashboard, and query management.

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit backend/.env and add your real keys
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit frontend/.env and add your real keys
npm run dev
```

## Environment variables

### Backend

Create `backend/.env` with:

```env
PORT=3001
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
HF_TOKEN=your_huggingface_api_token
DATA_GOV_IN_API_KEY=your_data_gov_api_key
```

### Frontend

Create `frontend/.env` with:

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

## Run the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Useful scripts

### Backend

- `npm run dev` — start backend with nodemon
- `npm start` — start backend normally
- `npm run seed:officer` — seed a default officer user

### Frontend

- `npm run dev` — start the frontend dev server
- `npm run build` — create a production build
- `npm run preview` — preview the production build

## Notes

- Do not commit `.env` or `.env.local` files.
- `frontend/dist/` is build output and is not part of source control.
- `backend/.env` and `frontend/.env` should contain only local secrets.

## Cleanup

Removed unnecessary build/test files from the repository and added proper ignore rules for environment files and build artifacts.
