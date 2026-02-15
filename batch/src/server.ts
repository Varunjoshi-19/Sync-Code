import ProtectedRoutes from "./routes/protected";
import SocketConnection from "./socket/socket";
import NormalRoutes from "./routes/normal";
import cookieParser from "cookie-parser";
import http, { Server } from "http";
import express from "express";
import dotenv from "dotenv"
import cors from 'cors';

async function startServer() {

  dotenv.config();
  const app = express();

  const PORT = process.env.PORT || 4000;
  const networkPort: any = "0.0.0.0";

  const allowedOrigins = process.env.ALLOWED_ORIGIN || ["http://localhost:3000", "http://192.168.1.4:3000"];
  console.log("Allowed Origins:", allowedOrigins);
  app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }));


  app.use(express.json());
  app.use(cookieParser());

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



