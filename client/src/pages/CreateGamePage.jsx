import { useState } from "react";

import { createLobby } from "../api/lobbyAPI";

import InviteLinks from "../components/InviteLinks";

function CreateGamePage() {

  const [playerCount, setPlayerCount] = useState(4);
  const [setupType, setSetupType] = useState("std");

  const [inviteLinks, setInviteLinks] = useState([]);

  async function handleCreateLobby() {

    const data = await createLobby({
      size: playerCount,
    });
    console.log(data);
    const links = [];
    for(let i = 0; i < playerCount; i++){
      links.push({
        seat: i + 1,
        url: `${window.location.origin}/join/${data.lobbyID}/${i}`
      });
    }
    setInviteLinks(links);
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
        <label>Setup:</label>
        <select
        value = {setupType}
        onChange = {(e) => setSetupType(e.target.value)}
        >
          <option value = {"std"}>Standard Setup</option>
          <option value = {"adv"}>Advanced Setup</option>
          <option value = {"trn"}>Advanced Setup - Tournament Rules</option>
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