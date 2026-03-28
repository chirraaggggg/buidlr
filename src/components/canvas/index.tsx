"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
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
import DeviceFrame from "./device-frame";
import DeviceFrameSkeleton from "./device-frame-skeleton";

export { TOOL_MODE_ENUM, type ToolModeType } from "@/lib/canvas-tools";

/**
 * Teleports children to document.body so no ancestor overflow:hidden
 * or CSS transform can clip or misplace them.
 */
function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
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
  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.HAND);
  const [zoomPercentage, setZoomPercentage] = useState(100);

  const latestFrame = frames[frames.length - 1];

  // ── Keyboard shortcuts (V = select, H = hand, +/- = zoom) ────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case "v":
          setToolMode(TOOL_MODE_ENUM.SELECT);
          break;
        case "h":
          setToolMode(TOOL_MODE_ENUM.HAND);
          break;
        case "=":
        case "+":
          transformRef.current?.zoomIn(0.25);
          break;
        case "-":
          transformRef.current?.zoomOut(0.25);
          break;
        case "0":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            transformRef.current?.resetTransform();
          }
          break;
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <DeviceFrameSkeleton style={{}} />
          </div>
          <div className="z-10">
            <CanvasLoader status={currentStatus} />
          </div>
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

  // ── Ready — Figma-like canvas ─────────────────────────────────────────────
  const isHandMode = toolMode === TOOL_MODE_ENUM.HAND;

  return (
    <>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          cursor: isHandMode ? "grab" : "default",
        }}
      >
        <TransformWrapper
          ref={transformRef}
          initialScale={0.85}
          minScale={0.1}
          maxScale={6}
          centerOnInit
          limitToBounds={false}
          /* Always allow wheel zoom — like Figma */
          wheel={{ step: 0.08, activationKeys: [] }}
          pinch={{ step: 5 }}
          /* HAND mode → pan enabled; SELECT mode → pan disabled */
          panning={{
            disabled: !isHandMode,
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
              "!w-full !h-full select-none bg-canvas-dot-grid",
              isHandMode
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-default"
            )}
            contentStyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              /* Massive surface area for infinite canvas panning */
              width: "10000px",
              height: "10000px",
            }}
            contentClass="will-change-transform"
          >
            <DeviceFrame
              html={latestFrame.htmlContent}
              frameId={latestFrame.id || "preview-1"}
              theme_style={theme?.style}
            />
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
