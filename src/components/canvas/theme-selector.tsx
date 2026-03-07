"use client";

import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, CheckIcon } from "lucide-react";
import { useCanvas } from "../../../context/canvas-context";
import { cn } from "@/lib/utils";

export const ThemeSelector = () => {
  const { themes, theme, setTheme } = useCanvas();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
          <Palette className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 rounded-xl" align="center" sideOffset={14}>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5 mb-1">
            Themes
          </h4>
          {themes.map((t) => (
            <Button
              key={t.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start font-normal rounded-lg px-2 py-1.5 h-auto",
                theme?.id === t.id && "bg-accent text-accent-foreground font-medium"
              )}
              onClick={() => setTheme(t.id)}
            >
              <div className="flex items-center w-full justify-between">
                <span>{t.name}</span>
                {theme?.id === t.id && <CheckIcon className="w-4 h-4 text-primary" />}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
