const LobbyManager = require("../lobbies/LobbyManager.js");
const WebSocket = require("ws");

function handleMessage(ws, data, lobbyManager){
    switch (data.type){

        case "AUTHENTICATE":{
            const result = lobbyManager.getSeatByToken(data.payload.inviteToken);

            if(!result){
                ws.send(JSON.stringify({
                    type: "ERROR",
                    payload: "Invalid token"
                }));
                return;
            }

            const {lobby, seat} = result;

            seat.connect(ws);
            ws.seat = seat;
            ws.lobby = lobby;
            ws.send(JSON.stringify({
                type: "LOBBY_UPDATED",
                payload: lobby.getLobbyData()
            }));

            break;
        }

    }
}