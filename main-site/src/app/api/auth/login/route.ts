import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { loginSchema } from "../../../schema/auth.schema";
import { ApiEndPoints } from "@/app/Config/endPoints";
import dotenv from "dotenv";

dotenv.config();

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("sceret ", secret, refreshSecret);
        const { email, password } = loginSchema.parse(body);

        if (!email.trim() || !password.trim()) {
            return NextResponse.json(
                { error: "Email or password is missing" },
                { status: 401 }
            );
        }

        // call external API
        const apiRes = await fetch(ApiEndPoints.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                { error: data.message || "Login failed" },
                { status: 401 }
            );
        }

        const userInfo = {
            id: data.user.id,
            fullName: data.user.fullName,
            email: data.user.email,
        };

        const accessToken = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("10m")
            .sign(secret);

        const refreshToken = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(refreshSecret);

        const res = NextResponse.json({ ok: true, user: userInfo });

        res.cookies.set("access-token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 600,
        });

        res.cookies.set("refresh-token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });


        return res;
    } catch (error: any) {
        return NextResponse.json(
            { error: "Server error " + error.message },
            { status: 401 }
        );
    }
}
