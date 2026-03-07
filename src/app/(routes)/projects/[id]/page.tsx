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
    <div className="relative h-screen w-full flex flex-col">
      <Header projectName={project?.name} />

      <CanvasProvider
        initialFrames={frames}
        initialTheme={theme}
        hasInitialData={hasInitialData}
        projectId={project?.id}
        isPending={isPending}
      >
        {/* Floating toolbar — must be inside CanvasProvider to access useCanvas() */}
        <CanvasFloatingToolbar />

        <div className="flex w-full flex-1 overflow-auto">
          <div className="relative w-full">
            <Canvas />
          </div>
        </div>
      </CanvasProvider>
    </div>
  );
};

export default Page;

