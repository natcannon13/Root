import autumnMap from "../../ASSETS2/maps/autumn.png"
function Board(){
    return(
        <img src={autumnMap} alt = "Autumn Map" style = {{
            width: '100%',
            height: '100%',
            }}/>
    )
}
export default Board;