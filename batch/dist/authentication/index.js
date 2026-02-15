"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const connection_1 = require("../database/connection");
const verifyJwt = (token, secret) => new Promise((resolve, reject) => {
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err)
            reject(err);
        else
            resolve(decoded);
    });
});
const getUserById = async (userId) => {
    return connection_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
        },
    });
};
const handleValidateToken = async (req, res) => {
    const accessToken = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];
    if (!accessToken) {
        await handleTokenRefresh(refreshToken, res);
        return;
    }
    try {
        const decoded = await verifyJwt(accessToken, config_1.config.accessKey);
        const user = await getUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res.status(200).json({ message: "Token valid, user returned", user });
    }
    catch (err) {
        await handleTokenRefresh(refreshToken, res);
    }
};
exports.handleValidateToken = handleValidateToken;
const handleTokenRefresh = async (refreshToken, res) => {
    if (!refreshToken) {
        return res.status(404).json({ message: "Refresh token doesn't exist!" });
    }
    const newTokenData = await createNewAccessToken(refreshToken);
    if (!newTokenData) {
        return res.status(404).json({ message: "Failed to generate new access token, refresh token expired!" });
    }
    res.cookie("access-token", newTokenData.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
        path: "/",
    });
    return res.status(200).json({ message: "New access token created!", user: newTokenData.user });
};
const createNewAccessToken = async (refreshToken) => {
    try {
        const decoded = await verifyJwt(refreshToken, config_1.config.refreshKey);
        const user = await getUserById(decoded.userId);
        if (!user)
            return null;
        const token = jsonwebtoken_1.default.sign({ userId: decoded.userId }, config_1.config.accessKey, { expiresIn: "10m" });
        return { user, token };
    }
    catch {
        return null;
    }
};
