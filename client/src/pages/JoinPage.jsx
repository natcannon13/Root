import { useEffect } from "react";
import { useState } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import socket from "../websocket/socket";

import { initializeSocketHandlers } from "../websocket/socketHandlers";

import useGameStore from "../state/gameStore";

function JoinPage() {

  const [name, setName] = useState('');
  const handleNameChange = (event) =>{
    setName(event.target.value);
  }

  const { lobbyId, seatIndex } = useParams();

  const navigate = useNavigate();

  const setLobbyId = useGameStore(
    state => state.setLobbyId
  );

  useEffect(() => {
    initializeSocketHandlers(navigate);
    setLobbyId(lobbyId);
  }, []);

  async function join(){
    socket.send(JSON.stringify({
      type: "JOIN_SEAT",

      payload:{
        lobbyId: lobbyId,
        seatIndex: Number(seatIndex),
        name: name
      }
    }));
  }

  return (
    <div>
      Joining lobby...
      <div>
        <input
          type = "text"
          value = {name}
          onChange = {handleNameChange}
          placeholder="Your name here"
        />
        <button
          onClick={() => join(name)}
        >
          Join Game
        </button>
      </div>
    </div>
  );
}

export default JoinPage;