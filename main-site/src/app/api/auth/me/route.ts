import { cookies } from "next/headers"

export async function GET() {
    const cookie = await cookies();
    const token = cookie.get("access-token")?.value;

    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }

    // verify token with backend / JWT verify
   


    return Response.json({
        user: { id: 1, name: "User" },
    })
}
