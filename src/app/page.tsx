"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/ui/navbar";
import UserDropdown from "@/components/ui/user-profile-dropdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonalIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useChatStore } from "@/app/stores/useChatStore";
import { SidebarIcon } from "@/components/icons/SidebarIcon";
import { createChat } from "@/lib/db/dbOps";
import { AppSidebar } from "@/components/AppSidebar";
import axios from "axios";
import { useChatTitle } from "./hooks/useChatTitle";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const setPendingMsg = useChatStore((state) => state.setPendingMsg);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const { complete } = useChatTitle();

  const [isOn, setIsOn] = useState(false);

  // Toggles the sidebar state between open and closed.
  const handleToggle = () => {
    setIsOn(!isOn);
  };
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const autoResize = () => {
    const textarea: HTMLTextAreaElement | null = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate the new height
    textarea.style.height = "auto";
    // Set the height to scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Submit on Enter key (but not with Shift+Enter for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!session) {
        setShowLoginModal(true);
        setIsSubmitting(false);
        return;
      }
      // Create a chatId for this new conversation

      const chatId = await createChat(session.user.id, "New Chat");
      complete(inputText.trim(), {
        body: { chatId },
      });

      setPendingMsg(inputText);

      // Navigate to the chat page with the initial prompt and chatId
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error("Auth error : ", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleInput = () => {
      autoResize();
    };

    textarea.addEventListener("input", handleInput);
    autoResize();

    return () => {
      textarea.removeEventListener("input", handleInput);
    };
  }, []);

  return (
    // Main container for the entire page layout.
    <main className="bg-[#fafafa] relative flex h-screen max-h-screen flex-col overflow-hidden transition-all duration-200 ease-in-out">
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-row items-center gap-4 h-10 pr-2 mt-1 justify-between">
          <Navbar />
          {session ? (
            <UserDropdown
              email={session.user.email}
              image={session.user.image}
            />
          ) : (
            <div className="flex flex-row [&>*]:scale-90">
              <Button
                onClick={() => router.push("/signin")}
                className="bg-white dark:bg-black text-black dark:text-white border border-border dark:border-none hover:bg-zinc-300"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                className="bg-black dark:bg-white text-white dark:text-black"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <div className="group flex min-h-0 w-full flex-1 flex-row gap-4 transition-all duration-200 ease-in-out relative">
          <div className="absolute hidden md:block sidebar-trigger h-full w-5 z-40 bg-transparent" />

          {session && session.user && (
            <AppSidebar isOn={isOn} className="translate-y-10" />
          )}

          {/* --- Main Content Area --- */}

          <div className="h-full w-full p-2 overflow-hidden">
            <div className="bg-white h-full w-full rounded-md border transition-all duration-200 ease-in-out border-border flex flex-col">
              <div className="sticky top-0 z-10 flex-shrink-0">
                {session && session.user && (
                  <div className="sidebar-trigger max-w-max p-2">
                    <button
                      className="hover:bg-button-hover rounded-lg p-2"
                      onClick={handleToggle}
                    >
                      <SidebarIcon
                        className="text-subdued"
                        isCollapsed={isOn}
                      />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
                <p className="text-3xl p-4">Ask to animate anything</p>
                <div
                  onKeyDown={handleKeyDown}
                  className="flex flex-row w-10/12 border-border max-w-3xl drop-shadow-sm border rounded-sm items-center p-2"
                >
                  <Textarea
                    placeholder="Eg. Animate a ball rolling down from a plane inclined at 30 deg"
                    ref={textareaRef}
                    className="border-none resize-none shadow-none"
                    onInput={handleInputChange}
                  />
                  <Button
                    className="disabled:bg-[#fafafa] disabled:text-zinc-700 disabled:border disabled:border-border shadow-none rounded-sm aspect-square w-8 h-8 bg-black"
                    onClick={handleSubmit}
                    disabled={inputText === "" ? true : false}
                  >
                    <SendHorizonalIcon />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
