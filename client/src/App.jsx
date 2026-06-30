import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { initializeSocketHandlers } from "./websocket/socketHandlers";
import "./App.css";

import HomePage from "./pages/HomePage";
import CreateGamePage from "./pages/CreateGamePage";
import JoinPage from "./pages/JoinPage";
import LobbyPage from "./pages/LobbyPage";
//import GamePage from "./pages/GamePage";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    initializeSocketHandlers(navigate);
  }, [navigate]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/create" element={<CreateGamePage />} />

        <Route path="/join/:lobbyId/:seatIndex" element={<JoinPage />} />

        <Route path="/lobby/:lobbyId/:seatIndex" element={<LobbyPage />} />

        <Route path="/game/:lobbyID/:seatIndex" element={<GamePage />} />
      </Routes>
    </div>
  );
}

export default App;
