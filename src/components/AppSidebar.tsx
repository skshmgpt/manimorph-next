import { Chat } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const AppSidebar = ({
  isOn,
  className,
}: {
  isOn: boolean;
  className?: string;
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/data/chats");

        if (response.ok) {
          const data = await response.json();
          setChats(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch chats:", response.statusText);
          setChats([]);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div
      className={twMerge(
        "relative h-full min-w-3xs rounded-xl p-2 transition-all duration-200 ease-in-out",
        isOn && "-ml-[272px]",
      )}
    >
      <div
        style={{
          height: "90%",
        }}
        className={twMerge(
          "sidebar-wrapper border-secondary/50 absolute left-0 h-full w-full rounded-lg transition-all duration-200 ease-in-out p-2",
          isOn &&
            `bg-[#fafafa] hidden md:block border border-border rounded-lg-primary z-10 w-3xs ${className} border pl-6 group-has-[.sidebar-trigger:hover]:ml-[240px] group-has-[.sidebar-wrapper:hover]:ml-[240px]`,
          !isOn && "ml-[0px] h-full border-transparent bg-transparent",
        )}
      >
        {/* Content inside the hoverable panel */}
        <div className="flex h-full flex-col gap-2 sidebar-trigger ">
          {/* New Chat Button */}
          <button
            className="bg-button-bg hover:bg-button-hover text-body-sm flex w-full items-center justify-center gap-2 rounded-lg py-2 transition-colors duration-0 hover:bg-zinc-300 bg-white border border-border drop-shadow-sm"
            onClick={() => {
              router.push("/");
            }}
          >
            New Chat
          </button>

          {/* Navigation Menu */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {/* Recent Section */}

            {/* Chat History Items */}
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center text-gray-400 text-sm py-4">
                  Loading chats...
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-4">
                  No chats yet
                </div>
              ) : (
                chats.map((chat) => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <button
                      id={`recent-${chat.id}`}
                      className="hover:bg-zinc-200 text-sm group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-0 text-zinc-600"
                    >
                      <span className="text-subdued truncate">
                        {chat.title}
                      </span>
                    </button>
                  </Link>
                ))
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
