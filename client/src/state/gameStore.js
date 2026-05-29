import { create } from "zustand";

const useGameStore = create((set) => ({

  connected: false,

  lobby: null,

  seatIndex: null,

  lobbyId: null,

  gameState: null,

  socketConnected: false,

  chatMessages: [],

  chatError: null,

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
    set({ socketConnected }),

  appendChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
      chatError: null,
    })),
  
  setChatHistory: (messages) =>
    set({chatMessages: messages ?? [], chatError: null}),

  clearChat: () => 
    set({chatMessages: [], chatError: null}),

  setChatError: (chatError) =>
    set({chatError})
}));

export default useGameStore;