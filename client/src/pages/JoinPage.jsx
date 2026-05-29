import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../websocket/socket";
import useGameStore from "../state/gameStore";

function JoinPage() {
  const [name, setName] = useState("");

  const { lobbyId, seatIndex } = useParams();

  const setLobbyId = useGameStore((state) => state.setLobbyId);

  useEffect(() => {
    setLobbyId(lobbyId);
  }, [lobbyId, setLobbyId]);

  function join() {
    socket.send(
      JSON.stringify({
        type: "JOIN_SEAT",
        payload: {
          lobbyId,
          seatIndex: Number(seatIndex),
          name,
        },
      })
    );
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
