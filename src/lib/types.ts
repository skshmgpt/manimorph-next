import { UIMessage } from "ai";

export type ChatId = string & { __brand: "ChatId" };
export type UserId = string & { __brand: "UserId" };
export type ArtifactId = string & { __brand: "ArtifactId" };

export type Message = {
  chatId: ChatId;
  msgId: string;
  parts: UIMessage["parts"];
  content?: string;
  role: "user" | "assistant" | "data" | "system" | undefined;
  artifactId?: string;
  status: "processing" | "completed" | "failed";
  createdAt: Date;
};

export type Chat = {
  id: ChatId;
  userId: UserId;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type User = {
  userId: UserId;
  email: string;
  name?: string;
};

export type VideoArtifact = {
  artifactId: string;
  chatId: ChatId;
  name: string;
  description?: string;
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl: string | null;
};
