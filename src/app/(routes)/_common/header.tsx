"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = ({ user }: { user: any }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
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
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full h-8 w-8 transition-all duration-150"
                onClick={handleThemeToggle}
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
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-8 w-8 shrink-0 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={user?.picture || ""} alt={user?.given_name || "User Avatar"} />
                      <AvatarFallback className="rounded-lg">
                        {user?.given_name?.charAt(0)}
                        {user?.family_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutLink>Logout</LogoutLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginLink>
                <Button>Sign in</Button>
              </LoginLink>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
