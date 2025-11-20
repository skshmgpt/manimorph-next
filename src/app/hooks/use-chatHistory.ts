import axios from "axios";
import { Message } from "@/lib/types";
import { UIMessage } from "ai";

/**
 * Transforms a Message from DB to UIMessage format expected by useChat
 */
export const transformMessageToUIMessage = (message: Message): UIMessage => {
  return {
    id: message.msgId,
    role: message.role as UIMessage["role"],
    content: message.content || "",
    parts: message.parts,
    // Add artifactId if it exists (extending UIMessage)
    ...(message.artifactId && { artifactId: message.artifactId }),
  } as UIMessage;
};

export const getInitialMessages = async (
  chatId: string,
): Promise<[UIMessage[] | null, Error | null]> => {
  try {
    const response = await axios.get<Message[]>(`/api/data/chat/${chatId}`);

    if (response.status === 200 && Array.isArray(response.data)) {
      return [response.data.map(transformMessageToUIMessage), null];
    }

    return [null, new Error("resp_fmt_err")];
  } catch (error) {
    return [null, error as Error];
  }
};
