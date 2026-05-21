import socket from "./socket.js";

import useGameStore from "../state/gameStore.js";

export function initializeSocketHandlers(navigate) {

  socket.onopen = () => {

    console.log("Socket connected");

    useGameStore
      .getState()
      .setSocketConnected(true);
  };

  socket.onclose = () => {

    console.log("Socket disconnected");

    useGameStore
      .getState()
      .setSocketConnected(false);
  };

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    console.log("Server message:", data);

    switch (data.type) {

      case "AUTH_SUCCESS": {

        useGameStore
          .getState()
          .setLobby(data.payload.lobby);

        useGameStore
          .getState()
          .setSeatId(data.payload.seatIndex);

        navigate("/lobby");

        break;
      }

      case "LOBBY_UPDATED": {

        useGameStore
          .getState()
          .setLobby(data.payload.lobby);
          console.log(data);
          navigate(`/lobby/${data.payload.lobby.lobbyId}/${data.payload.seatIndex}`);

        break;
      }

      case "GAME_STARTED": {

        useGameStore
          .getState()
          .setGameState(data.payload);

        navigate("/game");

        break;
      }

      case "ERROR": {

        alert(data.payload);

        break;
      }

      default:
        console.log("Unknown message type:", data.type);
    }
  };
}