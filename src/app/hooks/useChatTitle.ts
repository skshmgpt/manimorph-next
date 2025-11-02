import { updateChatTitle } from "@/lib/db/dbOps";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";

interface MessageSummaryPayload {
  title: string;
  chatId: string;
}

export const useMessageSummary = () => {
  const { complete, isLoading } = useCompletion({
    api: "/api/completion",
    onResponse: async (response) => {
      try {
        const payload: MessageSummaryPayload = await response.json();

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
