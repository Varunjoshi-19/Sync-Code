import { Server as httpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import SocketHandler from "./socket-handler";


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
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true,

            },
            maxHttpBufferSize: 1e8,

        });

        this.socketModel.on("connection", (socket: Socket) => {
            this.socketModel?.to(socket.id).emit("connDetailReq");
            socketHandler.initSocketHandler(socket, this.socketModel!);
        });

        this.socketModel.on("disconnect", (socket: Socket) => {
            socketHandler.handleWhenUserDisconnects(socket.id);
        });


    }


}

export default SocketConnection