const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const cors = require("cors");

const LobbyManager = require("./lobbies/LobbyManager.js");
const handleMessage = require("./websocket/handlers.js");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const lobbyManager = new LobbyManager();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    handleMessage(
            ws,
            data,
            lobbyManager
        );
    console.log("Received:", data);

    // echo back for now
    ws.send(JSON.stringify({ type: "PONG", payload: data }));
  });

  ws.send(JSON.stringify({ type: "CONNECTED" }));

  ws.on("close", () => {

        lobbyManager.disconnectSocket(ws);
    });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});