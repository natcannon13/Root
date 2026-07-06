import socket from "./socket.js";

import useGameStore from "../state/gameStore.js";
import { saveSession } from "../session/playerSession.js";
import { attemptRejoinFromRoute } from "./rejoin.js";

export function initializeSocketHandlers(navigate) {

  socket.onopen = () => {

    console.log("Socket connected");

    useGameStore
      .getState()
      .setSocketConnected(true);

    attemptRejoinFromRoute();
  };

  socket.onclose = () => {

    console.log("Socket disconnected");

    useGameStore
      .getState()
      .setSocketConnected(false);
  };

  if (socket.readyState === WebSocket.OPEN) {
    useGameStore.getState().setSocketConnected(true);
    attemptRejoinFromRoute();
  } else if (socket.readyState === WebSocket.CLOSED) {
    useGameStore.getState().setSocketConnected(false);
  }

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    console.log("Server message:", data);

    switch (data.type) {

      case "LOBBY_UPDATED": {

        useGameStore.getState().setLobby(data.payload.lobby);
        useGameStore.getState().setSeatIndex(data.payload.seatIndex);

        const { lobby, seatIndex } = data.payload;
        const playerName = lobby.seats[seatIndex]?.playerName;
        if (playerName) {
          saveSession(lobby.lobbyId, seatIndex, playerName);
        }
        const onGamePage = window.location.pathname.startsWith("/game/");

        if (lobby.status === "waiting" && !onGamePage) {
          navigate(`/lobby/${lobby.lobbyId}/${seatIndex}`);
        }
        break;
      }

      case "GAME_STARTED": {

        useGameStore.getState().setLobby(data.payload.lobby);
        useGameStore.getState().setSeatIndex(data.payload.seatIndex);
        useGameStore
          .getState()
          .setGameState(data.payload);

        navigate(`/game/${data.payload.lobby.lobbyId}/${data.payload.seatIndex}`);

        break;
      }

      case "CHAT_MESSAGE":{
        useGameStore.getState().appendChatMessage(data.payload);
        break;
      }

      case "CHAT_HISTORY":{
        useGameStore.getState().setChatHistory(data.payload.messages);
        break;
      }

      case "ERROR": {

        const msg = typeof data.payload === "string" ? data.payload: "Unknown error";
        useGameStore.getState().setChatError(msg);
        break;
      }

      default:
        console.log("Unknown message type:", data.type);
    }
  };
}