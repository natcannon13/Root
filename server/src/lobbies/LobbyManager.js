const Lobby = require("./Lobby");

class LobbyManager{

    constructor(){
        this.lobbies = new Map();
        this.inviteTokenMap = new Map();
    }

    createLobby(settings = {}){
        const size = settings.size ?? 4;
        const lobby = new Lobby(size);
        this.lobbies.set(lobby.id, lobby);
        for(const seat of lobby.seats){
            this.inviteTokenMap.set(seat.inviteToken, {lobby, seat});
        }
        return lobby;
    }

    getLobby(lobbyID){
        return this.lobbies.get(lobbyID);
    }

    getSeatByToken(inviteToken){
        return this.inviteTokenMap.get(inviteToken);
    }

    disconnectSocket(socket){
        for (const lobby of this.lobbies.values()){
            for (const seat of lobby.seats){
                if(seat.socket === socket){
                    seat.disconnect();

                    lobby.broadcastLobby();
                    return;
                }
            }
        }
    }
}
module.exports = LobbyManager;