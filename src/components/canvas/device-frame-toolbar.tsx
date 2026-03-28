import { cn } from "@/lib/utils";
import React from "react";
import { Code, Download, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PropsType = {
  title: string;
  isSelected: boolean;
  disabled?: boolean;
  isDownloading: boolean;
  scale: number;
  onOpenHtmlDialog: () => void;
  onDownlodingPng: () => void;
}

const DeviceFrameToolbar: React.FC<PropsType> = ({ 
  title,
  isSelected,
  disabled = false,
  isDownloading,
  onOpenHtmlDialog,
  onDownlodingPng
}) => {
  return (
    <div
      className={cn(
        "absolute -top-9 left-[-2px] z-50 flex items-center gap-1 rounded-t-lg bg-card px-2 py-1 shadow-sm transition-all duration-200 ease-out select-none border-2 border-b-0 border-blue-500",
        isSelected
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 translate-y-2 invisible pointer-events-none",
        disabled && "opacity-50 pointer-events-none"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-center h-6 w-6 cursor-grab active:cursor-grabbing text-muted-foreground mr-1 hover:text-foreground">
        <GripVertical className="h-4 w-4" />
      </div>

      <span className="text-xs font-semibold text-foreground mr-4 cursor-default whitespace-nowrap">
        {title}
      </span>

      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        className="h-6 w-6 rounded hover:bg-muted text-muted-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onOpenHtmlDialog();
        }}
        title="View Code"
      >
        <Code className="h-3.5 w-3.5" />
        <span className="sr-only">View Code</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={disabled || isDownloading}
        className="h-6 w-6 rounded hover:bg-muted text-muted-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onDownlodingPng();
        }}
        title="Download PNG"
      >
        {isDownloading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        <span className="sr-only">Download PNG</span>
      </Button>
    </div>
  );
};

export default DeviceFrameToolbar;
