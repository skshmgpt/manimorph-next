import { auth } from "@/lib/auth";
import { getChatMessages } from "@/lib/db/dbOps";
import { headers } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id: chatId } = await params;

  try {
    const messages = await getChatMessages(chatId);
    return new Response(JSON.stringify(messages), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chat messages: ", error);
    return new Response("Error feching chat history", { status: 500 });
  }
}
