"use client";
import React from "react";
import { Button } from "./button";
import Image from "next/image";
import Logo from "../../../public/manimorph.webp";
const Navbar = ({ className }: { className?: string }) => {
  return (
    <header
      className={`text-black dark:text-white p-2 z-50 relative pointer-events-auto ${className}`}
    >
      <nav className="flex flex-row justify-between items-center h-7 pointer-events-auto">
        <Button
          variant="ghost"
          className={`cursor-pointer hover:bg-zinc-200 p-0 aspect-square`}
        >
          <Image src={Logo} alt="Logo" height={32} width={32} />
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
