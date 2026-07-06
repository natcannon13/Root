import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../websocket/socket";
import useGameStore from "../state/gameStore";
import { getSession, saveSession } from "../session/playerSession";
import { sendJoinSeat } from "../websocket/rejoin";

function JoinPage() {
  const { lobbyId, seatIndex } = useParams();

  const [name, setName] = useState("");

  const setLobbyId = useGameStore((state) => state.setLobbyId);

  useEffect(() => {
    setLobbyId(lobbyId);
  }, [lobbyId, setLobbyId]);

  useEffect(() => {
    const session = getSession(lobbyId, Number(seatIndex));
    if (session?.playerName) {
      setName(session.playerName);
    }
  }, [lobbyId, seatIndex]);

  function join() {
    saveSession(lobbyId, Number(seatIndex), name);
    sendJoinSeat(lobbyId, Number(seatIndex), name);
  }

  return (
    <div>
      Joining lobby...
      <div>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name here"
        />
        <button onClick={join}>Join Game</button>
      </div>
    </div>
  );
}

export default JoinPage;
