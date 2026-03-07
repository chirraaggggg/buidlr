"use client";

import React from "react";
import { ThemeType } from "@/lib/themes";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useCanvas } from "../../../context/canvas-context";
import { cn } from "@/lib/utils";

function parseThemeColors(styleString: string): Record<string, string> {
  const primaryMatch = styleString.match(/--primary:\s*(.+?);/);
  const secondaryMatch = styleString.match(/--secondary:\s*(.+?);/);
  const accentMatch = styleString.match(/--accent:\s*(.+?);/);
  const mutedMatch = styleString.match(/--muted:\s*(.+?);/);

  return {
    primary: primaryMatch ? primaryMatch[1].trim() : "#000",
    secondary: secondaryMatch ? secondaryMatch[1].trim() : "#000",
    accent: accentMatch ? accentMatch[1].trim() : "#000",
    muted: mutedMatch ? mutedMatch[1].trim() : "#000",
  };
}

function ThemeItem({
  theme,
  isSelected,
  onSelect,
}: {
  theme: ThemeType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const color = parseThemeColors(theme.style);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 w-full px-2 py-2 rounded-xl text-left transition-colors hover:bg-muted/40",
        isSelected && "bg-muted"
      )}
    >
      <div className="flex items-center -space-x-1.5 shrink-0">
        {["primary", "secondary", "accent", "muted"].map((key, i) => (
          <div
            key={key}
            className="w-5 h-5 rounded-full border-2 border-background"
            style={{ backgroundColor: color[key], zIndex: 4 - i }}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{theme.name}</span>
    </button>
  );
}

export const ThemeSelector = () => {
  const { themes, theme, setTheme } = useCanvas();
  const previewColors = themes.slice(0, 3).map((t) => parseThemeColors(t.style).primary);
  const extraCount = Math.max(0, themes.length - 3);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 px-1 py-1 rounded-full hover:bg-muted/50 transition-colors">
          {/* Large overlapping circles */}
          <div className="flex items-center -space-x-2.5">
            {previewColors.map((c, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900"
                style={{ backgroundColor: c, zIndex: 3 - i }}
              />
            ))}
          </div>
          {/* +N more */}
          <span className="text-[12px] font-medium text-gray-500 pl-2 whitespace-nowrap">
            +{extraCount} more
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-52 p-2 rounded-2xl" align="center" sideOffset={12}>
        <div className="flex flex-col max-h-72 overflow-y-auto">
          {themes.map((t) => (
            <ThemeItem
              key={t.id}
              theme={t}
              isSelected={theme?.id === t.id}
              onSelect={() => setTheme(t.id)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
