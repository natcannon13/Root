const RootGame = require("../game/RootGame.js");
const crypto = require("crypto");
const Seat = require("./Seat");

class Lobby{
    constructor(size = 4){
        this.id = crypto.randomUUID();

        this.status = "waiting";
        this.seats = [];
        this.game = null;

        for(let i = 0; i < size; i++){
            this.seats.push(new Seat());
        }
    }

    getSeat(index) {
        return this.seats[index];
    }

    broadcastLobby(){
        for (let i = 0; i < this.seats.length; i++) {
            const seat = this.seats[i];
            if (seat.connected && seat.socket) {
                const data = JSON.stringify({
                    type: "LOBBY_UPDATED",
                    payload:{
                        lobby: this.getLobbyData(),
                        seatIndex: i
                    }
                })
                seat.socket.send(data);
            }
        }
    }

    getLobbyData(){
        return{
            lobbyId: this.id,
            status: this.status,
            seats: this.seats.map(
                seat => seat.serialize()
            )
        };
    }

}
module.exports = Lobby;