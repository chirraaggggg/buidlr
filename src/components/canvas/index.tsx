"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCanvas } from "../../../context/canvas-context";
import type { LoadingStatusType } from "../../../context/canvas-context";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  TransformComponent,
  TransformWrapper,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/lib/canvas-tools";
import CanvasControls from "./canvas-controls";

export { TOOL_MODE_ENUM, type ToolModeType } from "@/lib/canvas-tools";

/**
 * Teleports children to document.body so no ancestor overflow:hidden
 * or CSS transform can clip or misplace them.
 */
function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─── Bottom toolbar (portaled so it always shows) ───────────────────────────
function FloatingControls({
  zoomIn,
  zoomOut,
  zoomPercentage,
  toolMode,
  toolType,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomPercentage: number;
  toolMode: ToolModeType;
  toolType: (m: ToolModeType) => void;
}) {
  return (
    <BodyPortal>
      <div
        style={{
          position: "fixed",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        <CanvasControls
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomPercentage={zoomPercentage}
          toolMode={toolMode}
          toolType={toolType}
        />
      </div>
    </BodyPortal>
  );
}

// ─── Corner badge (portaled) ─────────────────────────────────────────────────
function CornerBadge() {
  return (
    <BodyPortal>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 9999,
        }}
      >
        <a
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90"
          aria-label="Back to Buildr home"
        >
          B
        </a>
      </div>
    </BodyPortal>
  );
}

// ─── Main canvas component ───────────────────────────────────────────────────
const Canvas: React.FC = () => {
  const { frames, theme, isPending, loadingStatus } = useCanvas();

  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercentage, setZoomPercentage] = useState(100);

  const latestFrame = frames[frames.length - 1];

  // ── No content yet ───────────────────────────────────────────────────────
  if (!latestFrame) {
    return (
      <>
        <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            No screen generated yet. Use the prompt above to create a design.
          </p>
        </div>
        <FloatingControls
          zoomIn={() => {}}
          zoomOut={() => {}}
          zoomPercentage={zoomPercentage}
          toolMode={toolMode}
          toolType={setToolMode}
        />
        <CornerBadge />
      </>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  const currentStatus = isPending
    ? "fetching"
    : loadingStatus !== "idle" && loadingStatus !== "completed"
      ? loadingStatus
      : null;

  if (currentStatus) {
    return (
      <>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <CanvasLoader status={currentStatus} />
        </div>
        <FloatingControls
          zoomIn={() => {}}
          zoomOut={() => {}}
          zoomPercentage={100}
          toolMode={toolMode}
          toolType={setToolMode}
        />
        <CornerBadge />
      </>
    );
  }

  // ── Ready ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/*
       * absolute inset-0 → always fills the measured parent (main > div.h-full.w-full).
       * This guarantees TransformWrapper has a real, non-zero size and can get pointer events.
       */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          cursor: toolMode === TOOL_MODE_ENUM.HAND ? "grab" : "default",
        }}
      >
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.15}
          maxScale={6}
          centerOnInit
          limitToBounds={false}
          /* Wheel zooms without requiring Ctrl — just like Figma */
          wheel={{ step: 0.08, activationKeys: [] }}
          pinch={{ step: 5 }}
          panning={{
            disabled: toolMode === TOOL_MODE_ENUM.SELECT,
            velocityDisabled: false,
          }}
          doubleClick={{ disabled: false, mode: "reset" }}
          onTransformed={(_ref, state) => {
            setZoomPercentage(Math.round(state.scale * 100));
          }}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            wrapperClass={cn(
              "!w-full !h-full select-none",
              toolMode === TOOL_MODE_ENUM.HAND
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-default"
            )}
            contentClass="will-change-transform"
          >
            {/*
             * Preview frame — wide landscape rectangle styled like the screenshot.
             * No phone shape, just a clean bordered rectangle.
             */}
            <div
              className="canvas-preview-frame relative overflow-hidden rounded-lg border border-black/[0.08] bg-background shadow-xl dark:border-white/[0.08]"
              style={{
                width: "min(860px, 85vw)",
                height: "min(540px, 72vh)",
              }}
              data-canvas-preview
            >
              {/* Inject theme CSS variables */}
              {theme?.style && (
                <style
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: theme.style }}
                />
              )}

              {/* Render the generated HTML */}
              <div
                className="h-full w-full overflow-auto"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: latestFrame.htmlContent }}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Toolbar — portaled to body so overflow-hidden never clips it */}
      <FloatingControls
        zoomIn={() => transformRef.current?.zoomIn(0.25)}
        zoomOut={() => transformRef.current?.zoomOut(0.25)}
        zoomPercentage={zoomPercentage}
        toolMode={toolMode}
        toolType={setToolMode}
      />
      <CornerBadge />
    </>
  );
};

// ─── Loader ──────────────────────────────────────────────────────────────────
function CanvasLoader({ status }: { status?: LoadingStatusType | "fetching" }) {
  const label =
    status === "fetching"
      ? "Loading Project…"
      : status === "running"
        ? "Running Analysis…"
        : status === "analyzing"
          ? "Analyzing Content…"
          : status === "generating"
            ? "Generating Design…"
            : "Processing…";

  const color =
    status === "fetching"
      ? "bg-zinc-700"
      : status === "running"
        ? "bg-amber-500"
        : status === "analyzing"
          ? "bg-blue-500"
          : "bg-purple-500";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-2xl px-5 py-3 text-white shadow-xl",
        color
      )}
    >
      <Spinner className="h-4 w-4 stroke-[3]" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export default Canvas;
