import { updateChatTitle } from "@/lib/db/dbOps";
import { useCompletion } from "@ai-sdk/react";

interface ChatTitlePayload {
  title: string;
  chatId: string;
}

export const useChatTitle = () => {
  const { complete, isLoading } = useCompletion({
    api: "/api/completion",
    onResponse: async (response) => {
      try {
        const payload: ChatTitlePayload = await response.json();

        if (response.ok) {
          const { title, chatId } = payload;
          await updateChatTitle(chatId, title);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return {
    complete,
    isLoading,
  };
};
