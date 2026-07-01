class RootGame{
    constructor(seats, setup){
        this.state = {
            stage: "drafting",
            setup: setup,
            players: seats.map(seat => ({
                seatIndex: seat.index,
                name: seat.playerName,
                faction: seat.faction
            })),
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