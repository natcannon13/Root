class RootGame{
    constructor(){
        this.state = {
            stage: "drafting",
            players: [],
            turn: 0
        }
    }

    takeAction(seatIndex, action){
        console.log(seatIndex, action);
    }

    getState(){
        return this.state;
    }
}
module.exports = RootGame;