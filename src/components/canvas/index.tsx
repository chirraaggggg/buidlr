"use client";

import React from "react";
import { useCanvas } from "../../../context/canvas-context";
import type { LoadingStatusType } from "../../../context/canvas-context";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/lib/canvas-tools";
import CanvasControls from "./canvas-controls";

export { TOOL_MODE_ENUM, type ToolModeType } from "@/lib/canvas-tools";

const CONTROLS_FIXED =
  "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 sm:bottom-8";

const Canvas: React.FC = () => {
  const { frames, theme, isPending, loadingStatus } = useCanvas();

  const [toolMode, setToolMode] = React.useState<ToolModeType>(
    TOOL_MODE_ENUM.SELECT
  );
  const [zoomPercentage, setZoomPercentage] = React.useState(100);

  const latestFrame = frames[frames.length - 1];

  if (!latestFrame) {
    return (
      <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          No screen generated yet. Use the prompt above to create a design.
        </p>
      </div>
    );
  }

  const currentStatus = isPending
    ? "fetching"
    : loadingStatus !== "idle" && loadingStatus !== "completed"
      ? loadingStatus
      : null;

  if (currentStatus) {
    return (
      <div
        className="relative flex h-full min-h-0 w-full flex-col"
        data-tool-mode={toolMode}
      >
        <CanvasLoader status={currentStatus} />
        <CanvasControls
          className={CONTROLS_FIXED}
          zoomIn={() => {}}
          zoomOut={() => {}}
          zoomPercentage={100}
          toolMode={toolMode}
          toolType={setToolMode}
        />
        <CanvasCornerBadge />
      </div>
    );
  }

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col"
      data-tool-mode={toolMode}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-6 sm:px-8 sm:py-10">
        <div
          className="canvas-preview-frame relative h-[min(720px,78vh)] w-[min(400px,92vw)] overflow-hidden rounded-[2rem] border border-black/10 bg-background shadow-2xl dark:border-white/10"
          data-canvas-preview
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.35}
            maxScale={4}
            centerOnInit
            limitToBounds={false}
            wheel={{ step: 0.12 }}
            pinch={{ step: 5 }}
            panning={{
              disabled: toolMode === TOOL_MODE_ENUM.SELECT,
              velocityDisabled: false,
            }}
            doubleClick={{ disabled: false, mode: "reset", step: 0.7 }}
            onTransformed={(_ref, state) => {
              setZoomPercentage(Math.round(state.scale * 100));
            }}
          >
            {(transformRef) => (
              <>
                <TransformComponent
                  wrapperClass={cn(
                    "h-full w-full touch-none",
                    toolMode === TOOL_MODE_ENUM.HAND &&
                      "cursor-grab active:cursor-grabbing"
                  )}
                  contentClass="h-full w-full will-change-transform"
                >
                  {theme?.style && (
                    <style
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: theme.style }}
                    />
                  )}

                  <div
                    className="h-full w-full overflow-auto"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: latestFrame.htmlContent }}
                  />
                </TransformComponent>

                <CanvasControls
                  className={CONTROLS_FIXED}
                  zoomIn={() => transformRef.zoomIn()}
                  zoomOut={() => transformRef.zoomOut()}
                  zoomPercentage={zoomPercentage}
                  toolMode={toolMode}
                  toolType={setToolMode}
                />
              </>
            )}
          </TransformWrapper>
        </div>
      </div>

      <CanvasCornerBadge />
    </div>
  );
};

/** Decorative corner control (matches reference bottom-left affordance). */
function CanvasCornerBadge() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
      <a
        href="/"
        className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Back to Buildr home"
      >
        B
      </a>
    </div>
  );
}

function CanvasLoader({
  status,
}: {
  status?: LoadingStatusType | "fetching";
}) {
  return (
    <>
      <div
        className={cn(
          "absolute top-4 left-1/2 z-20 flex min-w-40 max-w-full -translate-x-1/2 items-center space-x-2 rounded-br-xl rounded-bl-xl px-4 pt-1.5 pb-2 shadow-md",
          status === "fetching" && "bg-gray-500 text-white",
          status === "running" && "bg-amber-500 text-white",
          status === "analyzing" && "bg-blue-500 text-white",
          status === "generating" && "bg-purple-500 text-white"
        )}
      >
        <Spinner className="stroke-3! h-4 w-4" />
        <span className="text-sm font-semibold capitalize">
          {status === "fetching"
            ? "Loading Project"
            : status === "running"
              ? "Running Analysis"
              : status === "analyzing"
                ? "Analyzing Content"
                : status === "generating"
                  ? "Generating Content"
                  : "Completed"}
        </span>
      </div>
    </>
  );
}

export default Canvas;
