const lobbyManager = require("../lobbies/LobbyManager.js");
const Lobby = require("../lobbies/Lobby.js");
const WebSocket = require("ws");

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
            seat.playerName = name;

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