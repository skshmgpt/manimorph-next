"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggle() {
   const { toggleSidebar } = useSidebar();

   return (
      <Button
         variant="ghost"
         size="sm"
         onClick={toggleSidebar}
         className="p-1 hover:bg-red-600"
      >
         <Menu className="h-5 w-5" />
         <span className="sr-only">Toggle Sidebar</span>
      </Button>
   );
}