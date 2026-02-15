"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socket_handler_1 = __importDefault(require("./socket-handler"));
const room_1 = require("../utils/room");
class SocketConnection {
    constructor() {
        this.httpModel = null;
        this.socketModel = null;
    }
    establishConnection(http) {
        this.httpModel = http;
        const socketHandler = new socket_handler_1.default();
        this.socketModel = new socket_io_1.Server(this.httpModel, {
            cors: {
                origin: ["http://localhost:3000", "http://192.168.1.4:3000"],
                methods: ["GET", "POST"],
                credentials: true,
            },
            maxHttpBufferSize: 1e8,
            transports: ["websocket"]
        });
        this.socketModel.on("connection", (socket) => {
            socketHandler.initSocketHandler(socket, this.socketModel);
            socket.on("disconnect", (reason) => {
                console.log("Reason", reason);
                (0, room_1.handleUserLeft)(socket, socket.id);
            });
        });
    }
}
exports.default = SocketConnection;
