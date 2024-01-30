"use client";

import { FaUser } from "react-icons/fa6";
import {ExitIcon} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar"

import React from 'react';
import {useCurrentUser} from "@/hooks/useCurrentUser";
import LogoutButton from "@/components/auth/logoutButton";

const UserButton = () => {
  const user = useCurrentUser();

  return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 to-blue-500">
              <FaUser className="text-white"/>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <LogoutButton>
            <DropdownMenuItem >
              <ExitIcon className="w-4 h-4 mr-4"/>
              Logout
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};

export default UserButton;