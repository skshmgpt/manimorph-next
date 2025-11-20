"use client";

import Navbar from "@/components/ui/navbar";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { authClient } from "@/lib/auth-client";
import { useChatStore } from "@/app/stores/useChatStore";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { renderMessage } from "@/lib/utils/index";
import { UIMessage } from "ai";
import { nanoid } from "nanoid";
import { saveMessage } from "@/lib/db/dbOps";
import { CodeEditor } from "@/components/CodeEditor";
import UserDropdown from "@/components/ui/user-profile-dropdown";
import { Message } from "@/lib/types";
import { startGeneration } from "@/lib/services/videoService";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getInitialMessages } from "@/app/hooks/use-chatHistory";
import {
  parseBreakdownXML,
  parseStreamingManimResponse,
} from "@/lib/utils/renderMessage";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "sonner";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const params = useParams();
  const chatId = params.id as string;
  const { data: session } = authClient.useSession();
  const hasProcessedPendingMsg = useRef(false);
  const hasFetchedMessages = useRef(false);
  const [isOn, setIsOn] = useState(true);

  const isMobile = useIsMobile();
  const [showArtifactPanel, setShowArtifactPanel] = useState(false);

  const router = useRouter();

  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageArtifacts, setMessageArtifacts] = useState<
    Record<string, string>
  >({});

  // Fetch initial messages on mount
  useEffect(() => {
    if (!chatId || hasFetchedMessages.current) return;

    hasFetchedMessages.current = true;

    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const [messages, error] = await getInitialMessages(chatId);
        if (error) {
          toast("Error fetching previous messages");
        } else if (messages !== null) {
          setInitialMessages(messages);

          const artifacts: Record<string, string> = {};
          messages.forEach((msg) => {
            if ((msg as Partial<UIMessage & Message>).artifactId) {
              artifacts[msg.id] = (
                msg as Partial<UIMessage & Message>
              ).artifactId!;
            }
          });
          setMessageArtifacts(artifacts);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const {
    pendingMsg,
    setPendingMsg,
    isEditorOpen,
    editorCode,
    editorTitle,
    isVideoOpen,
    videoArtifactId,
    videoTitle,
    clearPanels,
  } = useChatStore();

  useEffect(() => {
    clearPanels();
  }, [chatId, clearPanels]);

  const { messages, handleSubmit, input, setInput, status, stop, append } =
    useChat({
      initialInput: pendingMsg,
      id: chatId,
      initialMessages: initialMessages,
      onFinish: async (message) => {
        // Extract content from parts to parse code
        let content = "";
        message.parts?.forEach((part) => {
          if (part.type === "text" && "text" in part) {
            content += part.text;
          }
        });

        // Parse the response to extract code and title
        const { code, breakdown } = parseStreamingManimResponse(content);
        const { title } = parseBreakdownXML(breakdown as string);

        const aiMessage: Partial<UIMessage & Message> = {
          id: nanoid(10),
          parts: message.parts as UIMessage["parts"],
          role: "assistant",
          content: "",
          status: "completed",
        };

        // If code was generated in the response, trigger video generation
        if (code && code.trim()) {
          try {
            const artifactId = await startGeneration(
              code,
              "m",
              "DefaultScene",
              chatId,
              title || "Manim Animation",
            );
            aiMessage.artifactId = artifactId;

            setMessageArtifacts((prev) => ({
              ...prev,
              [message.id]: artifactId,
            }));
          } catch (error) {
            console.error("Failed to start video generation:", error);
          }
        }

        try {
          await saveMessage(chatId, aiMessage);
        } catch (err) {
          console.error("Failed to save assistant message:", err);
        }
      },
    });

  useEffect(() => {
    if (pendingMsg && pendingMsg.trim() && !hasProcessedPendingMsg.current) {
      hasProcessedPendingMsg.current = true;
      handleSubmit();
      const initialUserMsg: Partial<UIMessage & Message> = {
        id: nanoid(10),
        parts: [{ type: "text", text: pendingMsg }],
        role: "user",
        content: "",
        status: "completed",
      };
      saveMessage(chatId, initialUserMsg);
      if (setPendingMsg) {
        setPendingMsg("");
      }
    }
  }, [chatId, pendingMsg, handleSubmit, setPendingMsg]);

  const ChatPanel = () => {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden items-center px-1">
        {/* Messages container - scrollable */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="flex flex-col w-11/12 max-w-3xl mx-auto px-4 py-6 space-y-4">
            {messages.map((message) => {
              const enrichedMsg: Partial<UIMessage & Message> & {
                artifactId: string;
              } = messageArtifacts[message.id]
                ? { ...message, artifactId: messageArtifacts[message.id] }
                : message;

              return (
                <ChatMessage
                  key={nanoid(10)}
                  message={enrichedMsg}
                  renderMessage={renderMessage}
                />
              );
            })}
          </div>
        </div>
        <ChatInput
          userId={session?.user.id as string}
          chatId={chatId as string}
          setInput={setInput}
          input={input}
          messagesLen={messages.length}
          status={status}
          stop={stop}
          append={append}
        />
      </div>
    );
  };

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  const ArtifactPanel = () => {
    return (
      <div className="h-full mr-2 w-full overflow-hidden flex flex-col max-w-150 ">
        <div className="h-full w-full rounded-md border">
          {isEditorOpen && editorCode && (
            <CodeEditor
              code={editorCode}
              title={editorTitle}
              language="python"
            />
          )}
          {isVideoOpen && videoArtifactId && (
            <VideoPlayer artifactId={videoArtifactId} title={videoTitle} />
          )}
        </div>
      </div>
    );
  };

  const NormalLayout = () => {
    return (
      <>
        <div className="flex flex-row items-center gap-4 h-10 pr-2 mt-1 justify-between">
          <div className="sidebar-trigger" onClick={() => router.push("/")}>
            <Navbar />
          </div>
          {session && (
            <UserDropdown
              email={session?.user.email}
              image={session?.user.image}
            />
          )}
        </div>
        <div className="flex flex-row h-full w-full overflow-hidden p-1 pb-2 ">
          <AppSidebar isOn={isOn} className="-translate-y-2" />
          <div className="w-full flex flex-row ml-5">
            <ChatPanel />
            <ArtifactPanel />
          </div>
        </div>
      </>
    );
  };

  const MobileLayout = () => {
    return (
      <>
        {/* Backdrop overlay when sidebar is open */}
        {!isOn && (
          <div className="fixed inset-0 z-100" onClick={handleToggle} />
        )}

        {/* Sidebar overlay - slides in from left */}
        <div
          className={`fixed top-0 left-0 z-100 bg-white h-full z-50 transition-transform duration-300 ${
            isOn ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <AppSidebar isOn={false} className="" />
        </div>

        {/* Main content */}
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row items-center gap-4 h-10 pr-2 mt-1 justify-between">
            <div onClick={handleToggle}>
              <Navbar />
            </div>
            {session && (
              <UserDropdown
                email={session?.user.email}
                image={session?.user.image}
              />
            )}
          </div>
          <div className="flex bg-zinc-100 justify-center *:rounded-sm *:w-1/2 *:text-center rounded-sm border border-border m-2 h-8 *:font-semibold">
            <div
              className={`${showArtifactPanel ? "bg-transparent text-zinc-500" : "bg-white text-black"}`}
              onClick={() => setShowArtifactPanel(false)}
            >
              Chat
            </div>
            <div
              className={`${showArtifactPanel ? "bg-white text-black" : "bg-transparent text-zinc-500"}`}
              onClick={() => setShowArtifactPanel(true)}
            >
              Artifact
            </div>
          </div>
          {showArtifactPanel ? <ArtifactPanel /> : <ChatPanel />}
        </div>
      </>
    );
  };

  return (
    <main className="flex flex-col h-screen max-h-screen bg-[#fafafa] group">
      {isMobile ? <MobileLayout /> : <NormalLayout />}
    </main>
  );
}
