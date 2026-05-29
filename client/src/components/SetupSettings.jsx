import { useEffect, useRef, useState } from "react";

import useGameStore from "../state/gameStore";

function SetupSettings(setupType){
const [map, setMap] = useState("autumn");
const [deck, setDeck] = useState("mr");
const [knaveVB, setKnaveVB] = useState("knaves");

function MapChoice(){
    return (
        <div>
                    <label>Map:</label>
                    <select value = {map}
                    onChange ={(e) => setMap(e.target.value)}>
                        <option value = {"autumn"}>Autumn</option>
                        <option value = {"winter"}>Winter</option>
                        <option value = {"lake"}>Lake</option>
                        <option value = {"mountain"}>Mountain</option>
                        <option value = {"marsh"}>Marsh</option>
                        <option value = {"gorge"}>Gorge</option>
                    </select>
                </div>
    );
}

function DeckChoice(){
    return(
        <div>
            <label>Deck:</label>
            <select value = {deck}
            onChange = {(e) => setDeck(e.target.value)}>
                <option value = {"mr"}>Might and Right</option>
                <option value = {"ep"}>Exiles and Partisans</option>
                <option value = {"sd"}>Squires and Disciples</option>
            </select>
        </div>
    )
}

function KnaveVagabondChoice(){
    return(
        <div>
            <label>Knaves or Vagabond:</label>
            <select value = {knaveVB}
            onChange = {(e) => setKnaveVB(e.target.value)}>
                <option value = {"knaves"}>Use Knaves</option>
                <option value = {"vb"}>Use Vagabond</option>
                <option value = {"choice"}>Player Choice</option>
            </select>
        </div>
    )
}



    switch(setupType){
        case "std": {
            return(
                <div>
                <h1>Setup Settings</h1>
                <MapChoice/>
                <DeckChoice/>
                </div>
            )
            break;
        }
        case "adv": {
            return (
                <div>
                <h1>Setup Settings</h1>
                <MapChoice/>
                <DeckChoice/>
                <KnaveVagabondChoice/>
                </div>
            )
            break;
        }
        case "trn": {
            return (
                <div>
                <h1>Setup Settings</h1>
                <KnaveVagabondChoice/>
                </div>
            )
            break;
        }
    }

        return (
                <div>
                <h1>Setup Settings</h1>
                <MapChoice/>
                <DeckChoice/>
                <KnaveVagabondChoice/>
                </div>
            )

}

export default SetupSettings;