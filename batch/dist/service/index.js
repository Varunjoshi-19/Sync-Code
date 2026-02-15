"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetCreatedRooms = exports.populateTextCode = exports.handleRegister = exports.handleLogout = exports.handleLogin = void 0;
const room_1 = require("../cache/room");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const connection_1 = require("../database/connection");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const user = await connection_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw new Error("JWT secrets missing");
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, config_1.config.accessKey, { expiresIn: "10m" });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.config.refreshKey, { expiresIn: "7d" });
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("access-token", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 10 * 60 * 1000,
            path: "/"
        });
        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        return res.status(200).json({
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.handleLogin = handleLogin;
const handleLogout = async (req, res) => {
    res.cookie("access-token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
    });
    res.cookie("refresh-token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
};
exports.handleLogout = handleLogout;
const handleRegister = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(400).json({
                message: "Missing info !!",
            });
            return;
        }
        const hashPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await connection_1.prisma.user.create({
            data: {
                fullName: fullName,
                email: email,
                password: hashPassword
            },
            include: {
                rooms: true
            }
        });
        if (!user) {
            res.status(404).json({ message: "Failed to create user !!" });
            return;
        }
        res.status(200).json({ message: "User created !!" });
        return;
    }
    catch (error) {
        res.status(505).json({ message: `Internal server error ${error.message}` });
    }
};
exports.handleRegister = handleRegister;
const handleGetCreatedRooms = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId || typeof userId != "string") {
            res.status(404).json({ message: "Missing userId !!" });
            return;
        }
        const roomDetails = await connection_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                rooms: {
                    orderBy: {
                        updatedAt: "desc"
                    },
                    select: {
                        roomId: true,
                        title: true,
                        configSettings: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });
        res.status(200).json({ rooms: roomDetails?.rooms });
    }
    catch (error) {
        res.status(505).json({ message: `Internal server error ${error.message}` });
    }
};
exports.handleGetCreatedRooms = handleGetCreatedRooms;
const populateTextCode = (req, res) => {
    {
        const roomId = typeof req.params.roomId == "string" ? req.params.roomId : "";
        if (!roomId.trim()) {
            res.status(404).json({ message: "Invalid Room ID !!" });
            return;
        }
        if (!room_1.createdRooms.has(roomId)) {
            res.status(404).json({ message: "Room doesn't exists !!" });
            return;
        }
        const room = room_1.createdRooms.get(roomId);
        if (!room || !room.roomTextCode.trim()) {
            res.status(404).json({ message: "Room TextCode Empty !!" });
            return;
        }
        const textValue = room.roomTextCode;
        return res.status(200).json({ textCode: textValue });
    }
};
exports.populateTextCode = populateTextCode;
