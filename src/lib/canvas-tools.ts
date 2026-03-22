/**
 * Tools available on the canvas viewport (selection vs pan/hand).
 */
export const TOOL_MODE_ENUM = {
  /** Click/drag to select elements inside the preview (default). */
  SELECT: "SELECT",
  /** Pan/drag the canvas viewport (hand tool). */
  HAND: "HAND",
} as const;

export type ToolModeType =
  (typeof TOOL_MODE_ENUM)[keyof typeof TOOL_MODE_ENUM];
