"use client";

import React from "react";
import { ThemeSelector } from "./theme-selector";

const CanvasFloatingToolbar = () => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="w-full max-w-2xl bg-background dark:bg-gray-950 rounded-full shadow-xl border overflow-hidden p-1 flex">
        <div className="flex flex-row items-center gap-2 px-3">
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
};

export default CanvasFloatingToolbar;