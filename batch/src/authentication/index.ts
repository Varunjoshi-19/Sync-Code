import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../database/connection";

const verifyJwt = (token: string, secret: string) =>
    new Promise<any>((resolve, reject) => {
        jwt.verify(token, secret, (err : any, decoded : any) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });


const getUserById = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
        },
    });
};

const handleValidateToken = async (req: Request, res: Response) => {
    const accessToken = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];


    if (!accessToken) {
        await handleTokenRefresh(refreshToken, res);
        return;
    }

    try {
        const decoded: any = await verifyJwt(accessToken, config.accessKey);
        const user = await getUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "Token valid, user returned", user });
    } catch (err) {
        await handleTokenRefresh(refreshToken, res);
    }
};

const handleTokenRefresh = async (refreshToken: string | undefined, res: Response) => {
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

const createNewAccessToken = async (
    refreshToken: string
): Promise<{ user: any; token: string } | null> => {
    try {
        const decoded: any = await verifyJwt(refreshToken, config.refreshKey);
        const user = await getUserById(decoded.userId);

        if (!user) return null;

        const token = jwt.sign({ userId: decoded.userId }, config.accessKey, { expiresIn: "10m" });
        return { user, token };
    } catch {
        return null;
    }
};


export { handleValidateToken }