function sessionKey(lobbyId, seatIndex) {
  return `root:session:${lobbyId}:${seatIndex}`;
}

export function getSession(lobbyId, seatIndex) {
  try {
    const raw = sessionStorage.getItem(sessionKey(lobbyId, seatIndex));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(lobbyId, seatIndex, playerName) {
  sessionStorage.setItem(
    sessionKey(lobbyId, seatIndex),
    JSON.stringify({ playerName })
  );
}

export function clearSession(lobbyId, seatIndex) {
  sessionStorage.removeItem(sessionKey(lobbyId, seatIndex));
}
