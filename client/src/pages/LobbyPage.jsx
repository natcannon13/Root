import useGameStore from "../state/gameStore";

import SeatCard from "../components/SeatCard";
import ChatBox from "../components/ChatBox";
import SetupSettings from "../components/SetupSettings";

import socket from "../websocket/socket";

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 3fr 1fr',
  padding: '10px'
}

function LobbyPage() {

  const lobby = useGameStore(
    state => state.lobby
  );

  const seatIndex = useGameStore(
    state => state.seatIndex
  );


  if (!lobby) {
    return <div>Loading lobby...</div>;
  }

  function setReady(ready) {

    socket.send(JSON.stringify({
      type: "SET_READY",

      payload: {
        ready
      }
    }));
  }

  function startGame() {
    socket.send(JSON.stringify({
      type: "START_GAME",
      payload: {}
    }));
  }

  const mySeat = seatIndex != null ? lobby.seats[seatIndex] : undefined;
  const canStart = lobby.seats.every(s => s.connected && s.ready);

  return (
    <div style = {gridStyle}>
      <div>
        {
          seatIndex == 0 && <SetupSettings setupType={lobby.setup} />
        }
      </div>
    <div>

      <h1>Lobby</h1>

      <h2>Seats</h2>

      {
        lobby.seats.map(seat => (
          <SeatCard
            key={seat.index}
            seat={seat}
            isMe={seat.index === seatIndex}
          />
        ))
      }

      {
        mySeat && (
          <button
            onClick={() => setReady(!mySeat.ready)}
          >
            {
              mySeat.ready
                ? "Unready"
                : "Ready"
            }
          </button>
        )
      }

      {
        seatIndex === 0 && (
          <div>
            <button onClick={startGame} disabled={!canStart}>
              Start Game
            </button>
            {!canStart && (
              <p>Waiting for all players to be ready</p>
            )}
          </div>
        )
      }

    </div>
    <div className="lobby-chat-column">
      <ChatBox/>
    </div>

    </div>
  );
}

export default LobbyPage;