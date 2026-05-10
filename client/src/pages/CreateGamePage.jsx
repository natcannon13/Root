import { useState } from "react";

import { createLobby } from "../api/lobbyAPI";

import InviteLinks from "../components/InviteLinks";

function CreateGamePage() {

  const [playerCount, setPlayerCount] = useState(4);

  const [map, setMap] = useState("autumn");

  const [inviteLinks, setInviteLinks] = useState([]);

  async function handleCreateLobby() {

    const data = await createLobby({
      size: playerCount,
      map
    });

    setInviteLinks(data.inviteLinks);
  }

  return (
    <div>

      <h1>Create Game</h1>

      <div>
        <label>Players:</label>

        <select
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>

      <div>
        <label>Map:</label>

        <select
          value={map}
          onChange={(e) => setMap(e.target.value)}
        >
          <option value="autumn">Autumn</option>
          <option value="winter">Winter</option>
          <option value="lake">Lake</option>
          <option value="mountain">Mountain</option>
          <option value="marsh">Marsh</option>
          <option value="gorge">Gorge</option>
        </select>
      </div>

      <button onClick={handleCreateLobby}>
        Generate Invite Links
      </button>

      {
        inviteLinks.length > 0 && (
          <InviteLinks links={inviteLinks} />
        )
      }

    </div>
  );
}

export default CreateGamePage;