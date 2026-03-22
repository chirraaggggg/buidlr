"use client";

import React from "react";
import { Hand, MousePointer, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/lib/canvas-tools";

export type CanvasControlsProps = {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomPercentage: number;
  toolMode: ToolModeType;
  toolType: (toolMode: ToolModeType) => void;
  className?: string;
};

const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoomIn,
  zoomOut,
  zoomPercentage,
  toolMode,
  toolType,
  className,
}) => {
  return (
    <div
      className={cn(
        "z-50 flex items-center gap-1 rounded-full border bg-zinc-900 px-2 py-1.5 shadow-lg backdrop-blur-sm",
        "dark:border-zinc-700 dark:bg-zinc-950/95",
        className
      )}
      role="toolbar"
      aria-label="Canvas controls"
    >
      {/* Match reference: pointer (select) → hand → separator → zoom */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "size-8 shrink-0 text-white hover:bg-white/15 hover:text-white",
          toolMode === TOOL_MODE_ENUM.SELECT &&
            "bg-white/20 text-white ring-1 ring-white/40"
        )}
        onClick={() => toolType(TOOL_MODE_ENUM.SELECT)}
        aria-label="Select tool"
        aria-pressed={toolMode === TOOL_MODE_ENUM.SELECT}
      >
        <MousePointer className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "size-8 shrink-0 text-white hover:bg-white/15 hover:text-white",
          toolMode === TOOL_MODE_ENUM.HAND &&
            "bg-white/20 text-white ring-1 ring-white/40"
        )}
        onClick={() => toolType(TOOL_MODE_ENUM.HAND)}
        aria-label="Hand tool (pan)"
        aria-pressed={toolMode === TOOL_MODE_ENUM.HAND}
      >
        <Hand className="size-4" />
      </Button>

      <div
        className="mx-1 h-6 w-px shrink-0 bg-white/25"
        aria-hidden
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-white hover:bg-white/15 hover:text-white"
        onClick={() => zoomOut()}
        aria-label="Zoom out"
      >
        <ZoomOut className="size-4" />
      </Button>

      <span className="min-w-[2.75rem] text-center text-xs font-medium tabular-nums text-white">
        {zoomPercentage}%
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-white hover:bg-white/15 hover:text-white"
        onClick={() => zoomIn()}
        aria-label="Zoom in"
      >
        <ZoomIn className="size-4" />
      </Button>
    </div>
  );
};

export default CanvasControls;
