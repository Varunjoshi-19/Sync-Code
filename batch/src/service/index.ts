import { Request, Response } from "express"
import { createdRooms } from "../cache/room"
import bcrypt from "bcryptjs";
import { prisma } from "../database/connection";
import jwt from "jsonwebtoken";
import { config } from "../config";

const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw new Error("JWT secrets missing");
        }



        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            config.accessKey,
            { expiresIn: "10m" }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            config.refreshKey,
            { expiresIn: "7d" }
        );


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

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const handleLogout = async (req: Request, res: Response) => {

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

}

const handleRegister = async (req: Request, res: Response) => {

    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            res.status(400).json({
                message: "Missing info !!",
            });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
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
    catch (error: any) {
        res.status(505).json({ message: `Internal server error ${error.message}` })
    }


}

const handleGetCreatedRooms = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!userId || typeof userId != "string") {
            res.status(404).json({ message: "Missing userId !!" });
            return;
        }

        const roomDetails = await prisma.user.findUnique({
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

    } catch (error: any) {
        res.status(505).json({ message: `Internal server error ${error.message}` })
    }

}

const populateTextCode = (req: Request, res: Response) => {
    {
        const roomId = typeof req.params.roomId == "string" ? req.params.roomId : "";
        if (!roomId.trim()) {
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
    }

}





export {
    handleLogin,
    handleLogout,
    handleRegister,
    populateTextCode,
    handleGetCreatedRooms

}