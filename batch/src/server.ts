import express from "express";
import http, { Server } from "http";
import SocketConnection from "./socket/socket";
import { createdRooms } from "./cache/room";
import cors from 'cors';
import NormalRoutes from "./routes/normal";
import ProtectedRoutes from "./routes/protected";


async function startServer() {
  const app = express();

  const PORT = process.env.PORT || 4000;
  const networkPort: any = "0.0.0.0";

  app.use(express.json());

  app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  }));


  const server: Server = http.createServer(app);
  const socket = new SocketConnection();
  socket.establishConnection(server);



  app.use("/api", NormalRoutes);
  app.use("/protected", ProtectedRoutes);


  server.listen(PORT, networkPort, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });


}

startServer();



