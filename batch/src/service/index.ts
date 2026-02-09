import { Request, Response } from "express"
import { createdRooms } from "../cache/room"
import bcrypt from "bcryptjs";
import { prisma } from "../database/connection"
import jwt from "jsonwebtoken";

const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({
                message: "Invalid credentials",
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid credentials",
            });
            return
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
        return;

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
        return;
    }
};

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

        const roomDetails = prisma.user.findUnique({
            where: { id: userId },
            select: { rooms: true }
        });

        res.status(200).json({ rooms: roomDetails });

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
    handleRegister,
    populateTextCode,
    handleGetCreatedRooms

}