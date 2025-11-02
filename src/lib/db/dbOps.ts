"use server";
import { ChatModel, MessageModel, VideoArtifactModel } from "./models";
import { Chat, ChatId, Message, User, VideoArtifact } from "../types";
import { dbConnect } from "@/lib/db";
import { nanoid } from "nanoid";
import { UIMessage } from "ai";

// -------- chat ops ---------
export async function createChat(
  userId: string,
  title: string,
  chatId: string,
) {
  await dbConnect();
  console.log("creating chat");
  const now = Date.now();

  const chat = await ChatModel.create({
    id: chatId,
    userId,
    title,
    createdAt: now,
    updatedAt: now,
  });

  console.log("chat obj : ", JSON.stringify(chat));
}

export async function saveMessage(
  chatId: string,
  message: Partial<UIMessage & Message>,
) {
  await dbConnect();

  const now = Date.now();

  console.log("message : ", message);

  const messageData: Message = {
    chatId: chatId as ChatId,
    msgId: message.id || nanoid(),
    role:
      message.role === "user" || message.role === "assistant"
        ? message.role
        : (message.role = "user"),
    parts: message.parts || [],
    content: message.content || "",
    status: message.status || "completed",
    createdAt: now,
  };

  if (message.artifactId) {
    messageData.artifactId = message.artifactId;
  }
  console.log("message data : ", JSON.stringify(messageData));
  // Only include artifactId if it exists

  const newMessage = await MessageModel.create(messageData);

  if (chatId) {
    await ChatModel.findOneAndUpdate({ id: chatId }, { updatedAt: now });
  }
}

export async function updateChatTitle(
  chatId: string,
  title: string,
): Promise<Chat | null> {
  await dbConnect();
  const chat = await ChatModel.findOneAndUpdate(
    { id: chatId },
    { $set: { title: title } },
    { new: true },
  );
  return chat ? chat.toObject() : null;
}

export async function getChat(chatId: string): Promise<Chat | null> {
  await dbConnect();
  const chat = await ChatModel.findOne({ id: chatId });
  return chat ? chat.toObject() : null;
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  await dbConnect();
  const messages = await MessageModel.find({ chatId }).sort({ createdAt: 1 });
  return messages.map((msg) => msg.toObject());
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  await dbConnect();

  const chats = await ChatModel.find({ userId: userId }).sort({
    updatedAt: -1,
  });
  return chats.map((chat) => chat.toObject());
}

// ------------- VideoArtifact ops -------------

export async function createVideoArtifact(
  id: string,
  name: string,
  chatId: string,
): Promise<VideoArtifact> {
  await dbConnect();

  const VideoArtifact = await VideoArtifactModel.create({
    id: id,
    chatId: chatId,
    name: name,
    status: "pending",
    videoUrl: null,
  });

  return VideoArtifact.toObject();
}

export async function getVideoArtifact(
  ArtifactId: string,
): Promise<VideoArtifact | null> {
  await dbConnect();

  const VideoArtifact = await VideoArtifactModel.findOne({ id: ArtifactId });

  console.log("videoartifact : ", JSON.stringify(VideoArtifact));

  const artifact: VideoArtifact = {
    artifactId: ArtifactId,
    name: VideoArtifact.name,
    videoUrl: VideoArtifact.videoUrl,
    status: VideoArtifact.status,
    chatId: VideoArtifact.chatId,
  };

  return artifact;
}

export async function updateVideoArtifactStatus(
  VideoArtifactId: string,
  status: VideoArtifact["status"],
): Promise<VideoArtifact | null> {
  await dbConnect();

  const VideoArtifact = await VideoArtifactModel.findOneAndUpdate(
    { id: VideoArtifactId },
    { status },
    { new: true }, // return updated doc
  );

  return VideoArtifact ? VideoArtifact.toObject() : null;
}

export async function setVideoArtifactVideoUrl(
  VideoArtifactId: string,
  url: string,
): Promise<VideoArtifact | null> {
  await dbConnect();

  const VideoArtifact = await VideoArtifactModel.findOneAndUpdate(
    { id: VideoArtifactId },
    { videoUrl: url },
    { new: true },
  );

  return VideoArtifact ? VideoArtifact.toObject() : null;
}
