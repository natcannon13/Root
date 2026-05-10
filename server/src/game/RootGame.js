class RootGame{
    constructor(){
        this.state = {
            players: [],
            turn: 0
        }
    }

    takeAction(playerID, action){
        console.log(playerID, action);
    }

    getState(){
        return this.state;
    }
}
module.exports = RootGame;