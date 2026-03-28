"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getHTMLWrapper } from "@/lib/frame-wrapper";
import DeviceFrameToolbar from "./device-frame-toolbar";

export type DeviceFrameProps = {
  html: string;
  title?: string;
  width?: number;
  height?: number;
  frameId: string;
  theme_style?: string;
};

const DeviceFrame: React.FC<DeviceFrameProps> = ({
  html,
  title = "Preview",
  width = 375,
  height = 812,
  frameId,
  theme_style,
}) => {
  const srcdoc = getHTMLWrapper(html, title, theme_style, frameId);
  const [isSelected, setIsSelected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const frameRef = useRef<HTMLDivElement>(null);

  // Still maintaining state to sync React on drop:
  const [size, setSize] = useState({ w: width, h: height });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const dragRef = useRef({
    isDragging: false,
    isResizing: null as string | null,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
    startPosX: 0,
    startPosY: 0,
    currentW: width,
    currentH: height,
    currentX: 0,
    currentY: 0,
  });

  // Global click outside to deselect
  useEffect(() => {
    const handleGlobalPointerDown = (e: PointerEvent) => {
      if (isSelected && frameRef.current && !frameRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };
    window.addEventListener("pointerdown", handleGlobalPointerDown);
    return () => window.removeEventListener("pointerdown", handleGlobalPointerDown);
  }, [isSelected]);

  const handlePointerDownDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
    setIsSelected(true);
    
    dragRef.current = {
      ...dragRef.current,
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: dragRef.current.currentX,
      startPosY: dragRef.current.currentY,
    };
    
    document.body.style.cursor = "grabbing";
    
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerDownResize = (e: React.PointerEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
    setIsSelected(true);
    
    dragRef.current = {
      ...dragRef.current,
      isResizing: dir,
      startX: e.clientX,
      startY: e.clientY,
      startW: dragRef.current.currentW,
      startH: dragRef.current.currentH,
      startPosX: dragRef.current.currentX,
      startPosY: dragRef.current.currentY,
    };
    
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();

    let scale = 1;
    try {
      const contentEl = document.querySelector(".will-change-transform");
      if (contentEl) {
        const style = window.getComputedStyle(contentEl);
        if (style.transform && style.transform !== "none") {
          const match = style.transform.match(/matrix\(([^,]+)/);
          if (match && !isNaN(parseFloat(match[1]))) {
            scale = parseFloat(match[1]);
          }
        }
      }
    } catch {}
    if (scale <= 0) scale = 1;

    if (dragRef.current.isDragging) {
      const newX = dragRef.current.startPosX + (e.clientX - dragRef.current.startX) / scale;
      const newY = dragRef.current.startPosY + (e.clientY - dragRef.current.startY) / scale;
      
      dragRef.current.currentX = newX;
      dragRef.current.currentY = newY;
      
      if (frameRef.current && !isNaN(newX) && !isNaN(newY)) {
        frameRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    } 
    else if (dragRef.current.isResizing) {
      let newW = dragRef.current.startW;
      let newH = dragRef.current.startH;
      let newX = dragRef.current.startPosX;
      let newY = dragRef.current.startPosY;

      const deltaX = (e.clientX - dragRef.current.startX) / scale;
      const deltaY = (e.clientY - dragRef.current.startY) / scale;
      const dir = dragRef.current.isResizing;

      if (dir.includes("e")) newW += deltaX;
      if (dir.includes("w")) {
        newW -= deltaX;
        newX += deltaX;
      }
      if (dir.includes("s")) newH += deltaY;
      if (dir.includes("n")) {
        newH -= deltaY;
        newY += deltaY;
      }

      const minW = 200;
      const minH = 300;
      
      if (newW < minW) {
        if (dir.includes("w")) newX -= (minW - newW);
        newW = minW;
      }
      if (newH < minH) {
        if (dir.includes("n")) newY -= (minH - newH);
        newH = minH;
      }

      dragRef.current.currentW = newW;
      dragRef.current.currentH = newH;
      dragRef.current.currentX = newX;
      dragRef.current.currentY = newY;

      if (frameRef.current && !isNaN(newX) && !isNaN(newY)) {
        frameRef.current.style.width = `${newW}px`;
        frameRef.current.style.height = `${newH}px`;
        frameRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    }
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    dragRef.current.isResizing = null;
    document.body.style.cursor = "default";
    
    // Sync React state just so updates stick if component re-renders
    setSize({ w: dragRef.current.currentW, h: dragRef.current.currentH });
    setPos({ x: dragRef.current.currentX, y: dragRef.current.currentY });

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  const ResizeHandle = ({ dir }: { dir: string }) => {
    const cursors: Record<string, string> = {
      nw: "nwse-resize", n: "ns-resize", ne: "nesw-resize",
      e: "ew-resize", se: "nwse-resize", s: "ns-resize",
      sw: "nesw-resize", w: "ew-resize",
    };

    const positions: Record<string, string> = {
      nw: "-top-1.5 -left-1.5", n: "-top-1.5 left-1/2 -translate-x-1/2", ne: "-top-1.5 -right-1.5",
      w: "top-1/2 -translate-y-1/2 -left-1.5", e: "top-1/2 -translate-y-1/2 -right-1.5",
      sw: "-bottom-1.5 -left-1.5", s: "-bottom-1.5 left-1/2 -translate-x-1/2", se: "-bottom-1.5 -right-1.5",
    };

    return (
      <div
        onPointerDown={(e) => handlePointerDownResize(e, dir)}
        className={cn(
          "absolute w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto z-50 nodrag",
          positions[dir]
        )}
        style={{ cursor: cursors[dir] }}
      />
    );
  };

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative flex items-center justify-center transition-shadow bg-card cursor-pointer",
        isSelected ? "ring-2 ring-blue-500 shadow-xl" : "ring-1 ring-border shadow-sm hover:shadow-md",
        "nodrag rounded-lg" 
      )}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
      style={{
        width: size.w,
        height: size.h,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transformOrigin: "top left",
        willChange: "transform, width, height"
      }}
    >
      <DeviceFrameToolbar
        title={title}
        isSelected={isSelected}
        isDownloading={false}
        scale={1}
        onOpenHtmlDialog={() => {}}
        onDownlodingPng={() => {}}
        onPointerDownDrag={handlePointerDownDrag}
      />

      {isSelected && (
        <>
          <ResizeHandle dir="nw" />
          <ResizeHandle dir="n" />
          <ResizeHandle dir="ne" />
          <ResizeHandle dir="w" />
          <ResizeHandle dir="e" />
          <ResizeHandle dir="sw" />
          <ResizeHandle dir="s" />
          <ResizeHandle dir="se" />
        </>
      )}

      <iframe
        key={refreshKey}
        data-frame-id={frameId}
        title={title}
        srcDoc={srcdoc}
        sandbox="allow-scripts allow-same-origin"
        className="rounded-lg"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          background: "#fff",
          pointerEvents: "none",
        }}
        loading="lazy"
      />
    </div>
  );
};

export default DeviceFrame;