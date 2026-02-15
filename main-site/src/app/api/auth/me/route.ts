import { ApiEndPoints } from "@/app/Config/endPoints";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const backendRes = await fetch(ApiEndPoints.validate, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.get("cookie") || "",
            },
            credentials: "include",
        });

        const data = await backendRes.json();

        const response = NextResponse.json(data, { status: backendRes.status });

        const setCookie = backendRes.headers.get("set-cookie");
        if (setCookie) response.headers.set("set-cookie", setCookie);

        return response;
    } catch (err) {
        console.error("Validate User Proxy Error:", err);
        return NextResponse.json({ message: "Validation failed" }, { status: 500 });
    }
}
