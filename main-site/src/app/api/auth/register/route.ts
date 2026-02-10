import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { registrationSchema } from "../../../schema/auth.schema";
import { ApiEndPoints } from "@/app/Config/endPoints";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, password } = registrationSchema.parse(body);

        if (!email.trim() || !password.trim()) {
            return NextResponse.json(
                { error: "Email or password is missing" },
                { status: 401 }
            );
        }

        // call external API
        const apiRes = await fetch(ApiEndPoints.register, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName, email, password }),
        });

        const data = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                { error: data.error || "Registeration failed" },
                { status: 401 }
            );
        }


        const res = NextResponse.json({ ok: true });
        return res;
    } catch (error: any) {
        return NextResponse.json(
            { error: "Server error " + error.message },
            { status: 401 }
        );
    }
}
