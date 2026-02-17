# Biddy - IPL Auction Game 🏏

Biddy is a real-time multiplayer IPL Auction simulation game where users can host their own auctions, bid for players, manage squads, and compete to build the ultimate team. It features a robust real-time bidding system, chat functionality, and immersive auction dynamics.

## 🌟 Features

- **Real-time Bidding**: Live synchronized auction room using Socket.IO.
- **Multiplayer**: Support for multiple users joining a room as different IPL franchises.
- **Roles**: 
    - **Host**: Controls the auction flow (start auction, skip players, skip sets, change timers, manage RTM).
    - **Manager**: Bids for players to build their squad.
    - **Spectator**: Watches the action unfold.
- **RTM (Right to Match)**: Implements the official IPL RTM rule, allowing former teams to match the highest bid.
- **Chat System**: Real-time broadcast chat for auction updates and banter.
- **Squad Management**: View squad composition, purse remaining, and player stats.
- **Mobile Responsive**: Optimized UI for both desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Socket.IO, TypeScript
- **State Management**: React Hooks & Context (Frontend), In-Memory Store (Backend)

## 📂 Project Structure

```
biddy/
├── backend/            # Node.js + Socket.IO Server
│   ├── src/
│   │   ├── services/   # Business logic services
│   │   ├── sockets/    # Socket event handlers (host, chat, auction)
│   │   ├── store/      # In-memory room & state storage
│   │   └── shared/     # Shared types & constants
│   └── ...
├── frontend/           # React + Vite Client
│   ├── components/     # UI Components (AuctionScreen, ChatPanel, etc.)
│   ├── services/       # API & Socket clients
│   ├── App.tsx         # Main routing & layout
│   └── ...
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Venkat7123/Biddy-An_IPL_Auction_Game.git
    cd Biddy-An_IPL_Auction_Game
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    cp .env.example .env  # Configure PORT, ALLOWED_ORIGINS
    npm run dev
    ```

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    # Update .env if needed (VITE_SOCKET_URL=http://localhost:4000)
    npm run dev
    ```

4.  **Open the App:**
    Visit `http://localhost:5173` in your browser.

## 🎮 How to Play

1.  **Create a Room**: Go to "Host Auction", enter your name, and create a public or private room.
2.  **Join a Room**: Share the Room ID or Link with friends. They can join as Managers of different teams.
3.  **Start Auction**: Once all managers are ready, the Host starts the auction.
4.  **Bidding**:
    - Players appear one by one from different sets.
    - Click the bid button to place a bid.
    - The timer resets on every new bid.
5.  **Winning**: The highest bidder when the timer runs out wins the player!
6.  **RTM**: If a player's former team is present and has RTM cards, they get a chance to match the winning bid.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---