# Vanguard Command Center

Vanguard Command Center is a sophisticated, real-time B2B supply chain visualization and simulation platform. Built for global logistics analysts, it offers powerful geographic modeling to assess the macroeconomic impact of massive naval blockades, chokepoint failures, and cascading supply chain collapses.

## Features

- **True Algorithmic Pathfinding**: Runs a live Dijkstra Shortest-Path routing engine across a dynamic global maritime node graph. 
- **B2B Cargo Simulator**: Simulate exact financial damages (fuel, charter, insurance surges) for individual container ships when global chokepoints are compromised.
- **AI Mitigation Engine**: Generates dynamic contingency plans (e.g. Intermodal Air Freight Shifts, Vessel Speed Optimization) based on real-time detour calculations.
- **Wargame Engine**: Simulates cascading macroeconomic failures by blocking multiple critical global chokepoints simultaneously, assessing multi-trillion dollar trade impacts.
- **Dynamic 3D Visualization**: Built with React Globe GL, rendering real-time routing paths, live commodity pricing, and dynamic geospatial intelligence with a modern glassmorphic UI.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, Framer Motion, React Globe GL, Recharts.
- **Backend**: Python, FastAPI, NetworkX (Graph Routing).

## Running Locally

### 1. Start the Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The Command Center will be available at `http://localhost:3000`.

## Deployment

### Frontend (Vercel)
1. Push this repository to GitHub.
2. Import the `frontend` folder to Vercel.
3. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend URL.
4. Deploy!

### Backend (Render)
1. Create a new Web Service on Render.
2. Connect your GitHub repository and set the Root Directory to `backend`.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Deploy!
