"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetProjectById } from "../../../../../features/use-project-id";
import Header from "./_components/Header";
import { CanvasProvider } from "../../../../../context/canvas-context";
import Canvas from "@/components/canvas";
import CanvasFloatingToolbar from "@/components/canvas/canvas-floating-toolbar";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetProjectById(id);
  const project = data?.data;
  const frames = project?.frames || [];
  const theme = project?.theme || "";

  const hasInitialData = frames.length > 0;
  if (!isPending && !project) {
    return <div>Project not found</div>;
  }

  return (
    /*
     * Full-viewport column.
     * overflow-hidden is removed so portaled controls (position:fixed) are
     * not clipped — the header/body scroll is stopped by h-screen on the root.
     */
    <div className="flex h-screen w-full flex-col">
      <Header projectName={project?.name} />

      {/*
       * CanvasProvider must wrap the toolbar AND the canvas so both can
       * call useCanvas(). We give it flex-1 + min-h-0 so it fills the
       * remaining height and its children can use h-full / flex-1.
       */}
      <CanvasProvider
        initialFrames={frames}
        initialTheme={theme}
        hasInitialData={hasInitialData}
        projectId={project?.id}
        isPending={isPending}
      >
        {/* Top floating toolbar */}
        <CanvasFloatingToolbar />

        {/*
         * Canvas workspace.
         * flex-1 + min-h-0 + explicit height via flex ensures TransformWrapper
         * gets a real measured height and can receive pointer events.
         */}
        <main
          className="relative flex-1 min-h-0"
          aria-label="Canvas workspace"
        >
          {/* h-full propagates the measured height into the Canvas component */}
          <div className="h-full w-full">
            <Canvas />
          </div>
        </main>
      </CanvasProvider>
    </div>
  );
};

export default Page;
