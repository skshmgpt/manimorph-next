"use client";
import React from "react";
import { Button } from "./button";
import { signIn, signOut } from "@/lib/auth-client";
import Image from "next/image";
import Logo from "../../../public/manimorph.webp";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { SidebarTrigger, useSidebar } from "./sidebar";
import { usePathname, useRouter } from "next/navigation";

const Navbar = ({ className }: { className?: string }) => {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <header
      className={`text-black dark:text-white p-2 z-50 relative pointer-events-auto ${className}`}
    >
      <nav className="flex flex-row justify-between items-center h-7 pointer-events-auto">
        <Button
          variant="ghost"
          className={`
            ${
              pathName === "/" ? "underline font-bold text-md" : "text-md"
            } cursor-pointer hover:bg-zinc-200 p-0 aspect-square`}
          onClick={() => router.push("/")}
        >
          <Image src={Logo} alt="Logo" height={32} width={32} />
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
