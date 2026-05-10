const crypto = require("crypto");

class Seat{

    constructor(){
        this.id = crypto.randomUUID();

        this.inviteToken = crypto.randomUUID();

        this.socket = null;
        this.connected = false;
        this.playerName = null;
        this.ready = false;
        this.faction = null;
    }

    connect(socket){
        this.socket = socket;
        this.connected = true;
    }

    disconnect(){
        this.socket = null;
        this.connected = false;
    }
    
    serialize(){
        return{
            id: this.id,
            connected: this.connected,
            playerName: this.playerName,
            ready: this.ready,
            faction: this.faction
        };
    }
}

module.exports = Seat;