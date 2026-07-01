const lobbyManager = require("../lobbies/LobbyManager.js");
const Lobby = require("../lobbies/Lobby.js");
const WebSocket = require("ws");
const crypto = require("crypto");
const { validateChat } = require("../chat/chatValidation.js");
const ChatMessage = require("../chat/ChatMessage.js");

function handleMessage(ws, data, lobbyManager){
    switch (data.type){

        case "JOIN_SEAT":{
            const {lobbyId, seatIndex, name} = data.payload;
            const lobby = lobbyManager.getLobby(lobbyId);

            if(!lobby){
                ws.send(JSON.stringify({
                    type: "ERROR",
                    payload: "Invalid lobby"
                }));
                return;
            }
            const seat = lobby.getSeat(seatIndex);

            if(!seat){
                ws.send(JSON.stringify({
                    type: "ERROR",
                    payload: "Invalid seat"
                }));
                return;
            }

            seat.playerName = name;
            seat.connect(ws);
            ws.seat = seat;
            ws.lobby = lobby;
            lobby.broadcastLobby();
            ws.send(JSON.stringify({
                type: "CHAT_HISTORY",
                payload: {
                    messages: (lobby.chat.getMessages().map(m => m.toPayload()))
                }
            }));

            break;
        }

        case "SET_READY":{
            ws.seat.ready = data.payload.ready;
            ws.lobby.broadcastLobby();
            break;
        }

        case "START_GAME":{
            if(!ws.lobby || !ws.seat){
                return;
            }
            if(ws.seat.index !== 0){
                ws.send(JSON.stringify({
                    type: "ERROR",
                    payload: "Only the host can start the game"
                }));
                return;
            }
            if(ws.lobby.status !== "waiting"){
                ws.send(JSON.stringify({
                    type: "ERROR",
                    payload: "Game has already started"
                }));
                return;
            }
            if(!ws.lobby.canStart()){
                ws.send(JSON.stringify({
                    type: "ERROR",
                    payload: "Not all players are ready"
                }));
                return;
            }
            ws.lobby.startGame();
            break;
        }

        case "CHAT_MESSAGE":{
            if(!ws.lobby || !ws.seat){
                return;
            }
            const {text} = data.payload;
            if(!validateChat(text)){
                return;
            }
            const msg = new ChatMessage(
                crypto.randomUUID(),
                ws.seat.index,
                ws.seat.playerName,
                "user",
                text.trim(),
                Date.now()
            );
            ws.lobby.chat.addMessage(msg);
            ws.lobby.broadcastChat(msg.toPayload());
            break;
        }

    }
}

module.exports = {
    handleMessage
}