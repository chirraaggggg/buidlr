"use client";

import React from "react";
import { getHTMLWrapper } from "@/lib/frame-wrapper";

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

  return (
    <iframe
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
  );
};

export default DeviceFrame;