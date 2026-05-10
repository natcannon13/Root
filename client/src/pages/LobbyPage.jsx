import useGameStore from "../state/gameStore";

import SeatCard from "../components/SeatCard";

import socket from "../websocket/socket";

function LobbyPage() {

  const lobby = useGameStore(
    state => state.lobby
  );

  const seatId = useGameStore(
    state => state.seatId
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

  const mySeat = lobby.seats.find(
    seat => seat.id === seatId
  );

  return (
    <div>

      <h1>Lobby</h1>

      <h2>Seats</h2>

      {
        lobby.seats.map(seat => (
          <SeatCard
            key={seat.id}
            seat={seat}
            isMe={seat.id === seatId}
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

    </div>
  );
}

export default LobbyPage;