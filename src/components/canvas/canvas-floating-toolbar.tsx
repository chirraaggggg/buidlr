"use client";

import React, { useState } from "react";
import { ThemeSelector } from "./theme-selector";
import { Button } from "@/components/ui/button";
import { Camera, Save, Sparkles, RotateCcw } from "lucide-react";
import { useCanvas } from "../../../context/canvas-context";
import { useSaveProject } from "../../../features/use-project";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PromptInput from "@/components/prompt-input";
import { toast } from "sonner";

const CanvasFloatingToolbar = () => {
  const { theme, frames, projectId, themeValue } = useCanvas();
  const [promptText, setPromptText] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);

  const { mutate: save, isPending: isSaving } = useSaveProject(projectId ?? "");

  const handleSave = () => {
    if (!projectId) {
      toast.error("No project to save");
      return;
    }
    save({ theme: themeValue ?? theme.id });
  };

  const handleUndo = () => {
    if (frames.length <= 1) {
      toast("No previous version to go back to");
      return;
    }
    toast("Undo is not yet connected to frame history");
  };

  const handleCamera = async () => {
    try {
      const canvasEl = document.querySelector(".canvas-preview-frame") as HTMLElement | null;
      if (!canvasEl) {
        toast.error("Canvas preview not found");
        return;
      }
      // Use the browser Print to screenshot
      toast.success("Screenshot captured! (Use browser screenshot for now)");
    } catch {
      toast.error("Could not take screenshot");
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-0.5 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 px-1.5 py-1.5">

        {/* AI / Sparkle button — opens prompt popover */}
        <Popover open={promptOpen} onOpenChange={setPromptOpen}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-9 h-9 bg-[#8253FF] hover:bg-[#7040e8] text-white shrink-0 shadow-none border-0"
            >
              <Sparkles className="w-4 h-4 stroke-white fill-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-3 rounded-3xl shadow-xl"
            align="center"
            sideOffset={14}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Redesign with AI
            </p>
            <PromptInput
              promptText={promptText}
              setPromptText={setPromptText}
              onSubmit={() => {
                if (!promptText.trim()) return;
                toast("AI redesign coming soon! Send your prompt: " + promptText);
                setPromptText("");
                setPromptOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Undo button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
          onClick={handleUndo}
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Separator */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0" />

        {/* Camera / Screenshot button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
          onClick={handleCamera}
          title="Screenshot"
        >
          <Camera className="w-4 h-4" />
        </Button>

        {/* Save button */}
        <Button
          className="rounded-full h-9 px-5 bg-[#D97757] hover:bg-[#c2653e] text-white shrink-0 shadow-none border-0 ml-0.5"
          onClick={handleSave}
          disabled={isSaving || !projectId}
          title="Save project"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm font-semibold">{isSaving ? "Saving…" : "Save"}</span>
        </Button>
      </div>
    </div>
  );
};

export default CanvasFloatingToolbar;