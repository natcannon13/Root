import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import socket from "../websocket/socket";

import { initializeSocketHandlers } from "../websocket/socketHandlers";

import useGameStore from "../state/gameStore";

function JoinPage() {

  const { inviteToken } = useParams();

  const navigate = useNavigate();

  const setInviteToken = useGameStore(
    state => state.setInviteToken
  );

  useEffect(() => {

    initializeSocketHandlers(navigate);

    setInviteToken(inviteToken);

    socket.send(JSON.stringify({
      type: "AUTHENTICATE",

      payload: {
        inviteToken
      }
    }));

  }, []);

  return (
    <div>
      Joining lobby...
    </div>
  );
}

export default JoinPage;