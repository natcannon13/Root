function InviteLinks({ links }) {

  function copyLink(link) {

    navigator.clipboard.writeText(link);
  }

  function copyAll(){
    let text = "Play Root\n";
    for(let i = 0; i < links.length; i++){
      text += `Player ${(i+1)}: `;
      text += `${links[i].url}\n`;
      console.log(text);
    }
    navigator.clipboard.writeText(text);
  }

  return (
    <div>

      <h2>Invite Links</h2>

      {
        links.map((linkData, index) => (

          <div key={index}>

            <p>
              Player {index + 1}
            </p>

            <input
            type = "text"
              value={linkData.url}
              readOnly
            />

            <button
              onClick={() => copyLink(linkData.url)}
            >
              Copy
            </button>

          </div>
        ))
      }

      <button
        onClick={() => copyAll()}
      >
        Copy All
      </button>
      <h3>If you are the host, join as Player 1.</h3>

    </div>
  );
}

export default InviteLinks;