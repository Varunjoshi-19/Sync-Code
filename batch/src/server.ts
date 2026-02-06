import express from "express";
import http, { Server } from "http";
import SocketConnection from "./socket/socket";
import cors from 'cors';
import { createdRooms } from "./cache/room";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 4000;

  app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }));


  const server: Server = http.createServer(app);
  const socket = new SocketConnection();
  socket.establishConnection(server);

  app.get("populate-document/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    if (!roomId) {
      res.status(404).json({ message: "Invalid Room ID !!" });
      return;
    }
    if (!createdRooms.has(roomId)) {
      res.status(404).json({ message: "Room doesn't exists !!" });
      return;
    }
    const room = createdRooms.get(roomId);
    if (!room || !room.roomTextCode.trim()) {
      res.status(404).json({ message: "Room TextCode Empty !!" });
      return;
    }
    const textValue = room.roomTextCode;
    return res.status(200).json({ textCode: textValue });
  })



  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });


}

startServer();

// const startWebSocketServer = () =>  {

// const app = express();
// const server = http.createServer(app);

// const wss = new ws.WebSocket.Server({server});

// wss.on("connection", (conn, req) => {
//   setupWSConnection(conn, req);
// });

// app.get("/", (req, res) => {
//   res.send("Realtime server running");
// });

// server.listen(4000, () => {
//   console.log("Yjs WebSocket Server running on port 4000");
// });

// }


// startWebSocketServer();

