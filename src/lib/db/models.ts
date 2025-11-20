import { Schema, Document, model, models } from "mongoose";
import { VideoArtifact, Chat, Message } from "../types";

export interface VideoArtifactDocument extends VideoArtifact, Document {}

const VideoArtifactSchema = new Schema<VideoArtifactDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  videoUrl: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  chatId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
});

export interface MessageDocument extends Message, Document {}

const MessageSchema = new Schema<MessageDocument>({
  chatId: {
    type: String,
    required: true,
  },
  msgId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  parts: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  artifactId: {
    type: String,
    required: false,
  },
  status: {
    // for tracking message state and repolling during rerenders
    // as soon as response finishes, save to db, then update later with artifact id and status
    type: String,
    enum: ["processing", "completed", "failed"],
    required: true,
  },
});

export interface ChatDocument extends Chat, Omit<Document, "id"> {}

const ChatSchema = new Schema<ChatDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Number,
      default: Date.now(),
    },
    updatedAt: {
      type: Number,
      default: Date.now(),
    },
  },
  { id: false },
);

export const ChatModel = models.Chat || model<ChatDocument>("Chat", ChatSchema);
export const MessageModel =
  models.Message || model<MessageDocument>("Message", MessageSchema);
export const VideoArtifactModel =
  models.VideoArtifact || model("VideoArtifact", VideoArtifactSchema);
