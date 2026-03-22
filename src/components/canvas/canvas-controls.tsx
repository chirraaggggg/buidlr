"use client";

import React from "react";
import { MousePointer2, Hand, Minus, Plus } from "lucide-react";
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
        // Dark pill — matches reference screenshot exactly
        "flex items-center gap-0.5 rounded-full border border-white/10 bg-zinc-900 px-1.5 py-1.5 shadow-2xl",
        className
      )}
      role="toolbar"
      aria-label="Canvas controls"
    >
      {/* ── Select tool ─────────────────────────────────────── */}
      <ToolBtn
        active={toolMode === TOOL_MODE_ENUM.SELECT}
        onClick={() => toolType(TOOL_MODE_ENUM.SELECT)}
        label="Select (V)"
      >
        <MousePointer2 className="size-[15px]" />
      </ToolBtn>

      {/* ── Hand / pan tool ─────────────────────────────────── */}
      <ToolBtn
        active={toolMode === TOOL_MODE_ENUM.HAND}
        onClick={() => toolType(TOOL_MODE_ENUM.HAND)}
        label="Hand / Pan (H)"
      >
        <Hand className="size-[15px]" />
      </ToolBtn>

      {/* ── Separator ───────────────────────────────────────── */}
      <div className="mx-1.5 h-5 w-px shrink-0 bg-white/20" aria-hidden />

      {/* ── Zoom out ─────────────────────────────────────────── */}
      <ZoomBtn onClick={zoomOut} label="Zoom out (−)">
        <Minus className="size-[14px]" />
      </ZoomBtn>

      {/* ── Zoom percentage ──────────────────────────────────── */}
      <span className="min-w-[3rem] select-none text-center text-[13px] font-medium tabular-nums text-white/90">
        {zoomPercentage}%
      </span>

      {/* ── Zoom in ──────────────────────────────────────────── */}
      <ZoomBtn onClick={zoomIn} label="Zoom in (+)">
        <Plus className="size-[14px]" />
      </ZoomBtn>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

function ToolBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors",
        "hover:bg-white/15 hover:text-white",
        active && "bg-white/20 text-white ring-1 ring-white/30"
      )}
    >
      {children}
    </button>
  );
}

function ZoomBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
    >
      {children}
    </button>
  );
}

export default CanvasControls;
