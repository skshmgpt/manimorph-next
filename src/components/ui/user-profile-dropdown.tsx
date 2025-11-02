import Image from "next/image";
import DefaultProfile from "@/app/defaultprofile.webp";
import { signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Button } from "./button";
import { LogOutIcon } from "lucide-react";

const UserDropdown = ({
  email,
  image,
}: {
  email: string;
  image: string | null | undefined;
}) => {
  return (
    <div className="pointer-events-auto p-1">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Image
                src={image ? image : DefaultProfile}
                alt="profile"
                width={30}
                height={30}
                className="aspect-square rounded-full cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
              />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <span>Profile</span>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent className="border-0 w-52 z-50">
          <DropdownMenuItem>
            <span className="text-xs">{email}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              onClick={() => signOut()}
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto"
            >
              <LogOutIcon />
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
