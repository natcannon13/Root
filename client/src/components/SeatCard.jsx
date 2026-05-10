function SeatCard({ seat, isMe }) {

  return (
    <div
      style={{
        border: "1px solid white",
        marginBottom: "1rem",
        padding: "1rem"
      }}
    >

      <p>
        {isMe ? "You" : "Player"}
      </p>

      <p>
        Connected: {
          seat.connected
            ? "Yes"
            : "No"
        }
      </p>

      <p>
        Ready: {
          seat.ready
            ? "Yes"
            : "No"
        }
      </p>

      <p>
        Faction: {
          seat.faction || "None"
        }
      </p>

    </div>
  );
}

export default SeatCard