function InviteLinks({ links }) {

  function copyLink(link) {

    navigator.clipboard.writeText(link);
  }

  return (
    <div>

      <h2>Invite Links</h2>

      {
        links.map((linkData, index) => (

          <div key={index}>

            <p>
              Seat {index + 1}
            </p>

            <input
              value={linkData.link}
              readOnly
            />

            <button
              onClick={() => copyLink(linkData.link)}
            >
              Copy
            </button>

          </div>
        ))
      }

    </div>
  );
}

export default InviteLinks;