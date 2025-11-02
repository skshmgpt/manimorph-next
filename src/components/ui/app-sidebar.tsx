"use client";
import MaterialSymbolsChatAddOn from "../icons/ChatSymbol";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AppSidebar({ userId }: { userId: string }) {
  type Chat = { id: string; title?: string };
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch(`/api/chats?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch chats");
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  return (
    <Sidebar side="left" variant="inset" collapsible="offcanvas">
      <SidebarHeader className="-mt-1">
        <Link href={"/"}>
          <div className="rounded-md p-2 border border-border/50 bg-white drop-shadow-xs text-center text-black dark:text-white">
            <p className="font-semibold">New Chat</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSub>
                  {isLoading ? (
                    <SidebarMenuSubItem>Loading chats...</SidebarMenuSubItem>
                  ) : chats.length > 0 ? (
                    chats.map((chat) => (
                      <SidebarMenuSubItem key={chat.id}>
                        <Link
                          href={`/chat/${chat.id}`}
                          className="w-full truncate block hover:bg-zinc-800 rounded-md"
                        >
                          <span>{chat.title || "Untitled Chat"}</span>
                        </Link>
                      </SidebarMenuSubItem>
                    ))
                  ) : (
                    <SidebarMenuSubItem>No chats found</SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
