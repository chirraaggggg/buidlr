"use client";

import React from "react";
import { useCanvas } from "../../../context/canvas-context";

const Canvas: React.FC = () => {
  const { frames, theme } = useCanvas();

  const latestFrame = frames[frames.length - 1];

  if (!latestFrame) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20">
        <p className="text-sm text-muted-foreground">
          no screen is generated yet
        </p>
      </div>
    );
  }

  const currentStatus = isPending
    ? "fetching"
    : loadingStatus !=== "idle" && loadingStatus !== "completed"
    ? loadingStatus
    : null;
    
  return(
    <div className="relativ w-fu;; h-full overflow-hidden">
      {currentStatus && <CanvasLoader status={currentStatus} />}
      <div className={cn(
        `absolute inset-0 w-full h-full bg-[#eee]
        dark:bg-[#242423] p-3
        `)}></div>
    </div>
  )
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/20 p-6">
      <div className="relative h-[720px] w-[400px] overflow-hidden rounded-3xl border bg-background shadow-xl">
        
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
      </div>
    </div>
  );
};

function CanvasLoader({string}: { status?: LoadingStatusType | "fetching" }) {
    return(
        <div className={cn(
            `absolute top-4 left-1/2 -translate-x-1/2 min-w-40 max-w-full px-4 pt-1.5 pb-2 rounded-br-xl rounded-bl-xl shadow-md flex items-center space-x-2 z-50`,
            status === "fetching" && "bg-gray-500 text-white",
            status === "running" && "bg-amber-500 text-white",
            status === "analyzing" && "bg-blue-500 text-white",
            status === "generating" && "bg-purple-500 text-white"
        )}
        >
        <Spinner className="w-4 h-4 stroke-3!" />
        <span className="text-sm font-semibold capitalize">{status === "fetching" ? "Loading Project": status === "running" ? "Running Analysis": status === "analyzing" ? "Analyzing Content": status === "generating" ? "Generating Content": "Completed"}</span>
        </div>
    )
}

export default Canvas;