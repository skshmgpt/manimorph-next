import AnimationIcon from "@mui/icons-material/Animation";
import { Textarea } from "../ui/textarea";
import { ChatRequestOptions } from "ai";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import { memo, useCallback, useMemo } from "react";
import useAutoResizeTextArea from "@/app/hooks/useAutoResizeTextArea";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { SendHorizontalIcon, StopCircleIcon } from "lucide-react";
import { saveMessage } from "@/lib/db/dbOps";

interface StopButtonProps {
  stop: UseChatHelpers["stop"];
}

interface SendButtonProps {
  onSubmit: () => void;
  disabled: boolean;
}

interface ChatInputProps {
  userId: string;
  chatId: string;
  input: UseChatHelpers["input"];
  status: UseChatHelpers["status"];
  setInput: UseChatHelpers["setInput"];
  append: UseChatHelpers["append"];
  stop: UseChatHelpers["stop"];
  messagesLen: number;
}

const createUserMessage = (id: string, text: string): UIMessage => ({
  id,
  parts: [{ type: "text", text }],
  role: "user",
  content: text,
});

export const ChatInput = ({
  userId,
  chatId,
  input,
  status,
  setInput,
  append,
  stop,
  messagesLen,
}: ChatInputProps) => {
  const { textareaRef, adjustHeight } = useAutoResizeTextArea({
    minHeight: 72,
    maxHeight: 200,
  });

  const { id } = useParams();
  const router = useRouter();

  const isDisabled = useMemo(
    () => !input.trim() || status === "streaming" || status === "submitted",
    [input, status],
  );

  const handleSubmit = useCallback(async () => {
    const currentInput = textareaRef.current?.value || input;

    if (
      !currentInput.trim() ||
      status === "streaming" ||
      status === "submitted"
    ) {
      return;
    }

    const messageId = nanoid(10);

    const userMsg = createUserMessage(messageId, currentInput.trim());
    await saveMessage(chatId, userMsg);
    append(userMsg);
    setInput("");
    adjustHeight(true);

    //   complete(currentInput.trim(), {
    //     body: { threadId, messageId, isTitle: true },
    // })
  }, [input, status, setInput, adjustHeight, append, textareaRef, chatId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="flex flex-row max-w-3xl w-full border-border drop-shadow-sm border rounded-sm items-center p-2"
    >
      <Textarea
        placeholder={
          messagesLen >= 1 ? "Ask Follow up questions..." : "Ask Manimorph..."
        }
        ref={textareaRef}
        className="border-none resize-none shadow-none"
        onInput={handleInputChange}
        value={input}
      />

      {status === "submitted" || status === "streaming" ? (
        <StopButton stop={stop} />
      ) : (
        <SendButton onSubmit={handleSubmit} disabled={isDisabled} />
      )}
    </div>
  );
};

function PureStopButton({ stop }: StopButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={stop}
      aria-label="Stop generating response"
    >
      <StopCircleIcon size={20} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

const PureSendButton = ({ onSubmit, disabled }: SendButtonProps) => {
  return (
    <Button
      onClick={onSubmit}
      variant="default"
      size="icon"
      disabled={disabled}
      aria-label="Send message"
    >
      <SendHorizontalIcon size={18} />
    </Button>
  );
};

const SendButton = memo(PureSendButton);
