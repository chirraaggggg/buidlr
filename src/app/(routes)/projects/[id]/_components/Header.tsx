"use client";

import React, { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderProps = {
  projectName?: string;
};

const Header = ({ projectName }: HeaderProps) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "z-40 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4",
        "supports-backdrop-filter:bg-background/80 supports-backdrop-filter:backdrop-blur"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Logo />
        <button
          type="button"
          onClick={() => router.push("/")}
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back to home"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        {projectName && (
          <span className="truncate text-sm font-medium text-foreground max-w-[min(40vw,320px)]">
            {projectName}
          </span>
        )}
      </div>

      {mounted && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
        </Button>
      )}
    </header>
  );
};

export default Header;
