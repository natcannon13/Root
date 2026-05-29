
class Seat{

    constructor(index){
        this.index = index;
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
            index: this.index,
            connected: this.connected,
            playerName: this.playerName,
            ready: this.ready,
            faction: this.faction
        };
    }
}

module.exports = Seat;