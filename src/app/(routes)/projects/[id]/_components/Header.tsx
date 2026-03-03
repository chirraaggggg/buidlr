"use client";

import React from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

type HeaderProps = {
  projectName?: string;
};

const Header = ({ projectName }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="h-14 border-b bg-background flex items-center px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Logo />
        <button
          onClick={() => router.push("/")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        {projectName && (
          <span className="text-sm font-medium truncate max-w-[300px]">
            {projectName}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
