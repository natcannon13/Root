import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import socket from "../websocket/socket";

import { initializeSocketHandlers } from "../websocket/socketHandlers";

import useGameStore from "../state/gameStore";

function JoinPage() {
  console.log(useParams());

  const { lobbyId, seatIndex } = useParams();

  const navigate = useNavigate();

  const setLobbyId = useGameStore(
    state => state.setLobbyId
  );

  useEffect(() => {

    initializeSocketHandlers(navigate);

    setLobbyId(lobbyId);

    socket.send(JSON.stringify({
      type: "JOIN_SEAT",

      payload: {
        lobbyId,
        seatIndex: Number(seatIndex)
      }
    }));

  }, []);

  return (
    <div>
      Joining lobby...
    </div>
  );
}

export default JoinPage;