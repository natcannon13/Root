const lobbyManager = require("../lobbies/LobbyManager.js");
const Lobby = require("../lobbies/Lobby.js");
const WebSocket = require("ws");

function handleMessage(ws, data, lobbyManager){
    switch (data.type){

        case "JOIN_SEAT":{
            const {lobbyId, seatIndex} = data.payload;
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

            seat.connect(ws);
            ws.seat = seat;
            ws.lobby = lobby;
            lobby.broadcastLobby();

            break;
        }

    }
}

module.exports = {
    handleMessage
}