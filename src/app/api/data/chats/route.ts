import { getUserChats } from "@/lib/db/dbOps";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return new Response(JSON.stringify([]), { status: 401 });
    }

    const userId = session.user.id;
    const chats = await getUserChats(userId);

    return Response.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch chats" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
