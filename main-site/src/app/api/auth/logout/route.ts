import { ApiEndPoints } from "@/app/Config/endPoints";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const backendRes = await fetch(ApiEndPoints.logout, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.get("cookie") || "",
            },
            credentials: "include",
        });

        const setCookie = backendRes.headers.get("set-cookie");

        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

        response.headers.append(
            "set-cookie",
            `access-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
        );
        response.headers.append(
            "set-cookie",
            `refresh-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
        );

        if (setCookie) response.headers.append("set-cookie", setCookie);

        return response;
    } catch (err) {
        console.error("Logout Proxy Error:", err);
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}
