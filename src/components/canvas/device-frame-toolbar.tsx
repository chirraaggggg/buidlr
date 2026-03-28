import { cn } from "@/lib/utils";
import React from "react";
import { Code, Download, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type PropsType = {
  title: string;
  isSelected: boolean;
  disabled?: boolean;
  isDownloading: boolean;
  scale: number;
  onOpenHtmlDialog: () => void;
  onDownlodingPng: () => void;
  onPointerDownDrag?: (e: React.PointerEvent) => void;
}

const DeviceFrameToolbar: React.FC<PropsType> = ({ 
  title,
  isSelected,
  disabled = false,
  isDownloading,
  onOpenHtmlDialog,
  onDownlodingPng,
  onPointerDownDrag
}) => {
  return (
    <div
      className={cn(
        "absolute -top-[48px] left-[50%] -translate-x-[50%] w-full z-50 flex items-center justify-between rounded-full bg-card px-3 py-1.5 shadow-md border transition-all duration-200 ease-out select-none",
        isSelected
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible translate-y-2 pointer-events-none",
        disabled && "opacity-50 pointer-events-none"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="flex flex-1 items-center gap-2 cursor-grab active:cursor-grabbing text-muted-foreground mr-2 h-full py-0.5 pointer-events-auto hover:text-foreground nodrag"
        onPointerDown={onPointerDownDrag}
      >
        <GripVertical className="h-4 w-4" />
        <span className="text-xs font-medium text-foreground cursor-default whitespace-nowrap">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onOpenHtmlDialog();
          }}
          title="View Code"
        >
          <Code className="h-3.5 w-3.5" />
          <span className="sr-only">View Code</span>
        </Button>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || isDownloading}
          className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground"
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
    </div>
  );
};

export default DeviceFrameToolbar;
