"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/lib/canvas-tools";

type PropsType = {
  html: string;
  title?: string;
  width?: number;
  minHeight?: number | string;
  initialPosition?: { x: number; y: number };
  frameId: string;
  scale?: number;
  toolMode: ToolModeType;
  theme_style?: string;
};

/**
 * DeviceFrame
 *
 * Renders a single canvas preview frame that:
 * - Displays `html` content (with optional `theme_style` injected as a
 *   <style> tag so CSS custom-properties / overrides apply inside the frame).
 * - Respects the active `toolMode`: in SELECT mode the iframe intercepts
 *   pointer events so interactions inside the preview work; in HAND mode
 *   pointer events are suppressed so the parent pan gesture goes through.
 * - Can be dragged around the canvas (only while SELECT tool is active).
 * - Scales with the canvas zoom level via the `scale` prop so borders and
 *   shadows stay visually consistent regardless of zoom.
 */
const DeviceFrame: React.FC<PropsType> = ({
  html,
  title = "Preview",
  width = 860,
  minHeight = 540,
  initialPosition = { x: 0, y: 0 },
  frameId,
  scale = 1,
  toolMode,
  theme_style,
}) => {
  // ── Drag state ────────────────────────────────────────────────────────────
  const [position, setPosition] = useState(initialPosition);
  const isDragging = useRef(false);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number }>({
    mx: 0,
    my: 0,
    px: 0,
    py: 0,
  });
  const frameRef = useRef<HTMLDivElement>(null);

  const isSelectMode = toolMode === TOOL_MODE_ENUM.SELECT;

  // ── Drag handlers (only active in SELECT mode) ────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isSelectMode) return;
      // Only drag from the chrome/header area (not inside the content iframe)
      if ((e.target as HTMLElement).closest("[data-frame-content]")) return;

      isDragging.current = true;
      dragStart.current = {
        mx: e.clientX,
        my: e.clientY,
        px: position.x,
        py: position.y,
      };
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [isSelectMode, position]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - dragStart.current.mx) / (scale || 1);
    const dy = (e.clientY - dragStart.current.my) / (scale || 1);
    setPosition({
      x: dragStart.current.px + dx,
      y: dragStart.current.py + dy,
    });
  }, [scale]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Reset position if initialPosition prop changes externally
  useEffect(() => {
    setPosition(initialPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPosition.x, initialPosition.y]);

  // ── Compose the full HTML document to render inside the iframe ────────────
  const srcdoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; }
    ${theme_style ?? ""}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  return (
    <div
      ref={frameRef}
      data-frame-id={frameId}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width,
        minHeight,
        // Suppress pointer events in HAND mode so the pan gesture works
        pointerEvents: isSelectMode ? "auto" : "none",
        cursor: isSelectMode ? "default" : "inherit",
      }}
      className="canvas-preview-frame group"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* ── Frame chrome ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative flex h-full w-full flex-col overflow-hidden rounded-lg shadow-xl",
          "border border-black/[0.08] bg-background dark:border-white/[0.08]",
          isSelectMode && "group-hover:border-black/20 dark:group-hover:border-white/20",
          "transition-[border-color] duration-150"
        )}
        style={{ minHeight }}
      >
        {/* Title bar — acts as drag handle */}
        <div
          className={cn(
            "flex h-9 shrink-0 items-center gap-2 border-b border-black/[0.06] px-3",
            "bg-zinc-50 dark:border-white/[0.06] dark:bg-zinc-900",
            isSelectMode && "cursor-grab active:cursor-grabbing"
          )}
          title={isSelectMode ? "Drag to reposition" : undefined}
        >
          {/* Traffic-light dots */}
          <span className="flex items-center gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
          </span>

          {/* Frame title */}
          <span className="flex-1 select-none truncate text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {title}
          </span>
        </div>

        {/* ── Content area ──────────────────────────────────────────────── */}
        <div
          data-frame-content
          className="relative flex-1 overflow-hidden"
          style={{ minHeight: typeof minHeight === "number" ? minHeight - 36 : undefined }}
        >
          <iframe
            title={title}
            srcDoc={srcdoc}
            sandbox="allow-scripts allow-same-origin"
            className="h-full w-full border-0"
            style={{
              minHeight:
                typeof minHeight === "number"
                  ? minHeight - 36 // subtract title bar
                  : minHeight,
              // In HAND mode prevent the iframe from consuming pointer events
              pointerEvents: isSelectMode ? "auto" : "none",
            }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame;