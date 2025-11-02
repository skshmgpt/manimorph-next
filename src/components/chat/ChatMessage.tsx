import { Message } from "@/lib/types";
import { UIMessage } from "ai";
import { Dispatch, SetStateAction } from "react";

interface ChatMessageProps {
  message: Partial<UIMessage & Message> & { artifactId: string };
  renderMessage: (
    message: Partial<UIMessage & Message>,
    setUiState?: Dispatch<SetStateAction<"code" | "video" | "chat">>,
    setCode?: Dispatch<SetStateAction<string | null>>,
  ) => React.JSX.Element;
  setUiState?: Dispatch<SetStateAction<"code" | "video" | "chat">>;
  setCode?: Dispatch<SetStateAction<string | null>>;
}

export const ChatMessage = ({
  message,
  renderMessage,
  setUiState,
  setCode,
}: ChatMessageProps) => {
  return (
    <div className="whitespace-pre-wrap">
      {renderMessage(message, setUiState, setCode)}
    </div>
  );
};
