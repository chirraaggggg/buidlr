"use client";

import { useTransition } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    startTransition(() => {
      setTheme(isDark ? "light" : "dark");
    });
  };

  return (
    <div className="sticky top-0 right-0 left-0 z-30" suppressHydrationWarning>
      <header className="h-16 border-b bg-background py-4">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <a href="/" className="text-foreground-muted text-sm">
              Home
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full h-8 w-8 transition-all duration-150"
              onClick={handleThemeToggle}
              disabled={isPending}
            >
              <SunIcon
                className={cn(
                  "absolute h-5 w-5 transition-transform duration-150",
                  isDark ? "scale-100 rotate-0" : "scale-0 rotate-90",
                )}
              />
              <MoonIcon
                className={cn(
                  "absolute h-5 w-5 transition-transform duration-150",
                  isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0",
                )}
              />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button>Sign in</Button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
