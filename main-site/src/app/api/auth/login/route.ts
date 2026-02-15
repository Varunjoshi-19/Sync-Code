import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
        });

        const data = await backendRes.json();

        const cookieHeader = backendRes.headers.get("set-cookie");

        const response = NextResponse.json(data, { status: backendRes.status });

        if (cookieHeader) {
            response.headers.set("set-cookie", cookieHeader);
        }

        return response;
    } catch (err) {
        console.error("Login Proxy Error:", err);
        return NextResponse.json({ message: "Login failed" }, { status: 500 });
    }
}
