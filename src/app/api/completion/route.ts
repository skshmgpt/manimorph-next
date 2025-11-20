// for title generation

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { prompt, chatId } = await req.json();

  const google = createGoogleGenerativeAI();

  console.log("post /api/completion");

  try {
    const { text: title } = await generateText({
      model: google("gemini-flash-lite-latest"),
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 50 characters long
      - the title should be a summary of the user's message
      - you should NOT answer the user's message, you should only generate a title
      - do not use quotes or colons`,
      prompt,
    });
    console.log("title", title);
    return NextResponse.json({ title, chatId });
  } catch (error) {
    console.error("failed to generate title: [error] : ", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 },
    );
  }
}
