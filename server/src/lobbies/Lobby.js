const RootGame = require("../game/RootGame.js");
const ChatManager = require("../chat/ChatManager.js");
const ChatMessage = require("../chat/ChatMessage.js");
const crypto = require("crypto");
const Seat = require("./Seat");

class Lobby{
    constructor(size = 4, setup){
        this.id = crypto.randomUUID();

        this.status = "waiting";
        this.seats = [];
        this.game = null;
        this.setup = setup;

        this.chat = new ChatManager();

        for(let i = 0; i < size; i++){
            this.seats.push(new Seat(i));
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

    broadcastChat(message){
        const data = JSON.stringify({
                    type: "CHAT_MESSAGE",
                    payload: message
                })
        for(let i = 0; i < this.seats.length; i++){
            const seat = this.seats[i];
            if(seat.connected && seat.socket){
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
            ),
            setup: this.setup
        };
    }

    canStart(){
        return this.status === "waiting"
            && this.seats.length > 0
            && this.seats.every(s => s.connected && s.ready);
    }

    startGame(){
        this.status = "playing";
        this.game = new RootGame(this.seats, this.setup);

        const msg = new ChatMessage(
            crypto.randomUUID(),
            -1,
            "System",
            "system",
            "Game started",
            Date.now()
        );
        this.chat.addMessage(msg);
        this.broadcastChat(msg.toPayload());

        this.broadcastGameStarted();
    }

    broadcastGameStarted(){
        const gameState = this.game.getState();
        for (let i = 0; i < this.seats.length; i++) {
            const seat = this.seats[i];
            if (seat.connected && seat.socket) {
                seat.socket.send(JSON.stringify({
                    type: "GAME_STARTED",
                    payload: {
                        lobby: this.getLobbyData(),
                        seatIndex: i,
                        game: gameState
                    }
                }));
            }
        }
    }

}
module.exports = Lobby;