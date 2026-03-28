"use client";

import React, { useState } from "react";
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

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([srcdoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center transition-all bg-card cursor-pointer",
        isSelected ? "ring-2 ring-blue-500" : "ring-1 ring-border shadow-sm",
        "mx-auto" 
      )}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
      style={{ width, height }}
    >
      <DeviceFrameToolbar 
        title={title}
        isSelected={isSelected}
        isDownloading={false}
        scale={1}
        onOpenHtmlDialog={() => {}}
        onDownlodingPng={() => {}}
      />
      
      {isSelected && (
        <>
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-nwse-resize z-50" />
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-ns-resize z-50" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-nesw-resize z-50" />
          
          <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-ew-resize z-50" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-ew-resize z-50" />
          
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-nesw-resize z-50" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-ns-resize z-50" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-[1.5px] border-blue-500 rounded-[1px] pointer-events-auto cursor-nwse-resize z-50" />
        </>
      )}

      <iframe
        key={refreshKey}
        data-frame-id={frameId}
        title={title}
        srcDoc={srcdoc}
        sandbox="allow-scripts allow-same-origin"
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