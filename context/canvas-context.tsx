 "use client";

import React from "react";
import {
  ThemeType,
  THEMES,
  getTheme,
} from "@/lib/themes";
import { FrameType } from "../types/project";

type LoadingStatusType =
  | "idle"
  | "running"
  | "analyzing"
  | "generating"
  | "completed";

export type { LoadingStatusType };

export interface CanvasContextType {
  theme: ThemeType;
  /**
   * Raw value stored for the project theme – can be a theme id
   * or a custom CSS string coming from the backend.
   */
  themeValue: string | null;
  /**
   * Update theme by passing either a known theme id
   * or a custom CSS string.
   */
  setTheme: (value: string) => void;
  /**
   * Predefined themes a user can quickly choose from.
   */
  themes: ThemeType[];

  frames: FrameType[];
  setFrames: (frames: FrameType[]) => void;
  /**
   * Convenience helper to update a single frame.
   */
  updateFrame: (id: string, partial: Partial<FrameType>) => void;

  hasInitialData: boolean;
  projectId?: string;
  isPending?: boolean;
  loadingStatus?: LoadingStatusType;
}

const CanvasContext = React.createContext<CanvasContextType | undefined>(
  undefined
);

interface CanvasProviderProps {
  initialFrames: FrameType[];
  initialTheme: string;
  hasInitialData: boolean;
  projectId?: string;
  isPending?: boolean;
  loadingStatus?: LoadingStatusType;
  children: React.ReactNode;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({
  initialFrames,
  initialTheme,
  hasInitialData,
  projectId,
  isPending,
  loadingStatus,
  children,
}) => {
  const [frames, setFrames] = React.useState<FrameType[]>(() => initialFrames);
  const [themeValue, setThemeValue] = React.useState<string | null>(
    initialTheme || null
  );

  // Re-sync frames when initialFrames changes (e.g. API data arrives)
  React.useEffect(() => {
    if (initialFrames.length > 0) {
      setFrames(initialFrames);
    }
  }, [initialFrames]);

  // Re-sync theme when initialTheme changes
  React.useEffect(() => {
    if (initialTheme) {
      setThemeValue(initialTheme);
    }
  }, [initialTheme]);

  const theme = React.useMemo(
    () => getTheme(themeValue ?? undefined),
    [themeValue]
  );

  const themes = React.useMemo<ThemeType[]>(
    () => [...THEMES],
    []
  );

  const updateFrame = React.useCallback(
    (id: string, partial: Partial<FrameType>) => {
      setFrames((prev) =>
        prev.map((frame) =>
          frame.id === id ? { ...frame, ...partial } : frame
        )
      );
    },
    []
  );

  const value: CanvasContextType = {
    theme,
    themeValue,
    setTheme: setThemeValue,
    themes,
    frames,
    setFrames,
    updateFrame,
    hasInitialData,
    projectId,
    isPending,
    loadingStatus,
  };

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const ctx = React.useContext(CanvasContext);
  if (!ctx) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return ctx;
};