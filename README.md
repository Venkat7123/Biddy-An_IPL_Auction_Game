<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎮 Biddy - Online Multiplayer Auction Game

A real-time multiplayer auction game where players from around the world can join rooms and bid on players!

## 🚀 Quick Start (Local Development)

**Prerequisites:** Node.js 18+

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to play!

---

## 🌍 Deploy for Global Multiplayer

To allow players worldwide to connect, you need to deploy both the backend and frontend to the cloud.

### Option 1: Deploy Backend to Render (Free Tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo and select the `backend` folder
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `PORT`: `4000` (or let Render auto-assign)
     - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-app.vercel.app`)
5. Deploy and copy your backend URL (e.g., `https://biddy-backend.onrender.com`)

### Option 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select the `backend` folder
4. Set environment variables:
   - `PORT`: `${{RAILWAY_PORT}}` (Railway auto-assigns)
   - `ALLOWED_ORIGINS`: Your frontend URL
5. Deploy and get your backend URL

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Add environment variables:
   - `VITE_API_URL`: `https://your-backend-url.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend-url.com`
5. Deploy!

### Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repo
3. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variables:
   - `VITE_API_URL`: `https://your-backend-url.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend-url.com`
5. Deploy!

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `HOST` | Bind address | `0.0.0.0` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `*` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000/api` |
| `VITE_SOCKET_URL` | Socket.IO server URL | `http://localhost:4000` |
| `GEMINI_API_KEY` | Gemini API key (optional) | - |

---

## 🎯 How to Play

1. **Create a Room**: One player creates a game room
2. **Share the Room Code**: Other players join using the room code
3. **Start Auction**: The host starts the auction
4. **Bid!**: Players bid on auction items in real-time
5. **Win**: Highest bidder wins each item!

---

## 📁 Project Structure

```
biddy/
├── backend/          # Node.js + Express + Socket.IO server
│   ├── src/
│   │   ├── server.ts     # Main server entry
│   │   ├── app.ts        # Express app
│   │   ├── sockets/      # Real-time socket handlers
│   │   └── routes/       # REST API routes
│   └── package.json
│
└── frontend/         # React + Vite client
    ├── App.tsx
    ├── components/
    ├── services/
    │   ├── apiClient.ts      # REST API calls
    │   └── socketClient.ts   # Socket.IO connection
    └── package.json
```

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, Socket.IO
- **Real-time:** WebSocket connections via Socket.IO

---

## 📝 License

MIT
