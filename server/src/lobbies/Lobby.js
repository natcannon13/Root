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

    broadcast(message){
        const data = JSON.stringify(message);

        for (const seat of this.seats) {
            if (seat.connected && seat.socket) {
                seat.socket.send(data);
            }
        }
    }

    getLobbyData(){
        return{
            roomId: this.id,
            status: this.status,
            seats: this.seats.map(
                seat => seat.serialize()
            )
        };
    }

    generateInviteLinks(baseURL){
        return this.seats.map(seat => ({
            seatID: seat.id,
            link: `${baseURL}/join/${seat.inviteToken}`
        }));
    }
}
module.exports = Lobby;