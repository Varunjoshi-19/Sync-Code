"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protected_1 = __importDefault(require("./routes/protected"));
const socket_1 = __importDefault(require("./socket/socket"));
const normal_1 = __importDefault(require("./routes/normal"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
async function startServer() {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 4000;
    const networkPort = "0.0.0.0";
    const allowedOrigins = process.env.ALLOWED_ORIGIN || ["http://localhost:3000", "http://192.168.1.4:3000"];
    console.log("Allowed Origins:", allowedOrigins);
    app.use((0, cors_1.default)({
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    const server = http_1.default.createServer(app);
    const socket = new socket_1.default();
    socket.establishConnection(server);
    app.use("/api", normal_1.default);
    app.use("/protected", protected_1.default);
    server.listen(PORT, networkPort, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
startServer();
