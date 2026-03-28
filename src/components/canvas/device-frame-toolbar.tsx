import { cn } from "@/lib/utils";
import React from "react";
import { Monitor, Tablet, Smartphone, Code, Download, Loader2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type PropsType = {
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
  scale,
  onOpenHtmlDialog,
  onDownlodingPng
}) => {
  // A heuristic to choose the icon. If scale or other properties dictate device, we can adjust.
  // Since we don't have width/height anymore in PropsType, we'll use a generic Monitor or allow it to be static.
  const DeviceIcon = Monitor; 

  return (
    <div
      className={cn(
        "absolute -top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-full border bg-card/95 backdrop-blur dark:bg-muted/95 p-1.5 shadow-lg transition-all duration-200 ease-out select-none",
        isSelected
          ? "opacity-100 translate-y-0 scale-100 visible"
          : "opacity-0 translate-y-4 scale-95 invisible pointer-events-none",
        disabled && "opacity-50 pointer-events-none"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Device Info */}
      <div className="flex items-center gap-2 pl-3 pr-2 text-sm font-medium text-foreground cursor-default">
        <DeviceIcon className="h-4 w-4 text-muted-foreground mr-1" />
        <span className="truncate max-w-[140px] font-semibold">{title}</span>
        <span className="text-muted-foreground text-[11px] bg-muted px-2 py-0.5 rounded-md font-mono">
          {Math.round(scale * 100)}%
        </span>
      </div>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            onOpenHtmlDialog();
          }}
          title="View Code"
        >
          <Code className="h-4 w-4" />
          <span className="sr-only">View Code</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || isDownloading}
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            onDownlodingPng();
          }}
          title="Download PNG"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="sr-only">Download PNG</span>
        </Button>
        
        <Separator orientation="vertical" className="h-5 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
          }}
          title="More options"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </div>
    </div>
  );
};

export default DeviceFrameToolbar;
