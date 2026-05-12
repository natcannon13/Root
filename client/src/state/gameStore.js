import { create } from "zustand";

const useGameStore = create((set) => ({

  connected: false,

  lobby: null,

  seatId: null,

  inviteToken: null,

  gameState: null,

  socketConnected: false,

  setConnected: (connected) =>
    set({ connected }),

  setLobby: (lobby) =>
    set({ lobby }),

  setSeatIndex: (seatIndex) =>
    set({ seatIndex }),

  setLobbyId: (lobbyId) =>
    set({ lobbyId }),

  setGameState: (gameState) =>
    set({ gameState }),

  setSocketConnected: (socketConnected) =>
    set({ socketConnected })
}));

export default useGameStore;