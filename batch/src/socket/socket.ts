import { Server as httpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import SocketHandler from "./socket-handler";
import { handleUserLeft } from "../utils/room";


class SocketConnection {

    private httpModel: httpServer | null;
    private socketModel: SocketServer | null;

    constructor() {
        this.httpModel = null;
        this.socketModel = null;
    }

    establishConnection(http: httpServer) {
        this.httpModel = http;
        const socketHandler = new SocketHandler();

        this.socketModel = new SocketServer(this.httpModel, {
            cors: {
                origin: ["http://localhost:3000", "http://192.168.1.4:3000"],
                methods: ["GET", "POST"],
                credentials: true,

            },
            maxHttpBufferSize: 1e8,
            transports: ["websocket"]

        });

        this.socketModel.on("connection", (socket: Socket) => {
            socketHandler.initSocketHandler(socket, this.socketModel!);

            socket.on("disconnect", (reason) => {
                console.log("Reason" , reason);
                handleUserLeft(socket , socket.id);
            });
        });


    }


}

export default SocketConnection