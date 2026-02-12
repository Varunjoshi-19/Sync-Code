import { io } from "socket.io-client";
import { BACKEND_URL } from "../Config/endPoints";

const socket = io(BACKEND_URL, {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false
});

export default socket;