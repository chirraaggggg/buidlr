"use client";

import React, { useState } from "react";
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
      className="relative flex items-center justify-center"
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
      <iframe
        key={refreshKey}
        data-frame-id={frameId}
      title={title}
      srcDoc={srcdoc}
      sandbox="allow-scripts allow-same-origin"
      style={{
        width,
        height,
        border: "none",
        borderRadius: "2.5rem",
        display: "block",
        boxShadow:
          "0 25px 60px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
        background: "#fff",
        /* Let the parent canvas handle pointer events for pan/zoom.
           The iframe never steals them. */
        pointerEvents: "none",
      }}
      loading="lazy"
    />
    </div>
  );
};

export default DeviceFrame;