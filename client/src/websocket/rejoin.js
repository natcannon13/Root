import socket from "./socket.js";
import { getSession } from "../session/playerSession.js";

const ROUTE_PATTERN = /^\/(lobby|game)\/([^/]+)\/(\d+)/;

let lastRejoinKey = null;
let lastRejoinTime = 0;

export function sendJoinSeat(lobbyId, seatIndex, name) {
  if (socket.readyState !== WebSocket.OPEN) return false;

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
  return true;
}

export function attemptRejoinFromRoute() {
  const match = window.location.pathname.match(ROUTE_PATTERN);
  if (!match) return false;

  const [, , lobbyId, seatIndexStr] = match;
  const seatIndex = Number(seatIndexStr);
  const session = getSession(lobbyId, seatIndex);
  if (!session?.playerName) return false;

  const rejoinKey = `${lobbyId}:${seatIndex}`;
  const now = Date.now();
  if (rejoinKey === lastRejoinKey && now - lastRejoinTime < 500) {
    return false;
  }

  if (!sendJoinSeat(lobbyId, seatIndex, session.playerName)) {
    return false;
  }

  lastRejoinKey = rejoinKey;
  lastRejoinTime = now;
  return true;
}
