import socket from "../websocket/socket.js";
import useGameStore from "../state/gameStore.js";

const MAX_LENGTH = 300;

export function sendChatMessage(text){
    const trimmed = text.trim();
    const {socketConnected} = useGameStore.getState();

    if(!socketConnected){
        useGameStore.getState().setChatError("Not connected");
        return false;
    }
    
    if(trimmed.length === 0){
        useGameStore.getState().setChatError("Message cannot be empty");
        return false;
    }

    if(trimmed.length > MAX_LENGTH){
        useGameStore.getState().setChatError("Message too long (Max 300 characters)");
        return false;
    }

    socket.send(JSON.stringify({
        type: "CHAT_MESSAGE",
        payload: {text: trimmed}
    }))

    useGameStore.getState().setChatError(null)
    return true;
}