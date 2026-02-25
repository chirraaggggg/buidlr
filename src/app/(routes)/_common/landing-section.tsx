"use client";

import React, { memo, useState } from "react";
import PromptInput from "@/components/prompt-input";
import { Suggestion } from "@/components/ai-elements/suggestion";
import Header from "./header";
import {
  useCreateProject,
  useGetProjects,
} from "../../../../features/use-project";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { ProjectType } from "../../../../types/project";
import { ProjectModel } from "@/lib/generated/prisma/internal/prismaNamespaceBrowser";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { FolderOpenDotIcon } from "lucide-react";

type Props = {
  user: any;
};

const LandingSection = ({ user }: Props) => {
  const [promptText, setPromptText] = useState<string>("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null,
  );

  const userid = user?.id;

  const { mutate, isPending } = useCreateProject();
  const { data: projects, isLoading: isProjectsLoading, isError } =
    useGetProjects(userid);

  const suggestions = [
    {
      label: "Finance Tracker",
      value: "I want to design a personal finance tracker app",
    },
    {
      label: "Fitness Activity",
      value: "I want to design a fitness activity tracking app",
    },
    { label: "Food Delivery", value: "I want to design a food delivery app" },
    { label: "Travel Booking", value: "I want to design a travel booking app" },
    {
      label: "E-Commerce",
      value: "I want to design an e-commerce shopping app",
    },
    {
      label: "Meditation",
      value: "I want to design a meditation and wellness app",
    },
  ];

  const handleSuggestionClick = (value: string, label: string) => {
    setPromptText(value);
    setSelectedSuggestion(label);
  };

  const handleSubmit = () => {
    if (!promptText.trim()) return;
    mutate(promptText);
  };

  return (
    <>
    <div className="w-full min-h-screen bg-linear-to-b from-background via-background to-primary/5">
      <div className="flex flex-col">
        <Header user={user} />
        <div className="relative pt-20 md:pt-28">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-center font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight">
                Design mobile apps <br className="md:hidden" />
                <span className="bg-linear-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  in minutes
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-center font-medium text-foreground/80 leading-relaxed text-base sm:text-lg">
                Go from idea to beautiful app mockups in minutes by chatting
                with AI.
              </p>
            </div>

            <div className="flex w-full max-w-3xl flex-col items-center gap-8 relative z-50 mt-12">
              <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                <PromptInput
                  className="ring-2 ring-primary/30 hover:ring-primary transition-all duration-300"
                  promptText={promptText}
                  setPromptText={setPromptText}
                  isLoading={isPending}
                  onSubmit={handleSubmit}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3 px-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200 overflow-x-auto pb-2">
                {suggestions.map((s) => (
                  <Suggestion
                    key={s.label}
                    suggestion={s.label}
                    className={`text-sm! h-auto! px-4 py-2! rounded-full border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedSuggestion === s.label
                        ? "ring-2 ring-primary bg-primary/10 border-primary/50"
                        : "hover:bg-primary/5 hover:border-primary/40"
                    }`}
                    onClick={() => handleSuggestionClick(s.value, s.label)}
                  >
                    <span className="font-medium">{s.label}</span>
                  </Suggestion>
                ))}
              </div>

            </div>
          </div>

          {/* Semi-circle ring decoration — behind the prompt box */}
          <div className="absolute left-0 right-0 pointer-events-none z-0 top-[20%] sm:top-[15%] md:top-[10%] h-[250px] sm:h-[350px] md:h-[500px]">
            <svg
              className="w-full h-full"
              viewBox="0 0 1440 500"
              preserveAspectRatio="xMidYMax meet"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0 500 Q 720 30 1440 500"
                stroke="var(--primary)"
                strokeWidth="2.5"
                opacity="0.3"
                fill="none"
              />
              <path
                d="M 0 500 Q 720 100 1440 500"
                stroke="var(--primary)"
                strokeWidth="1.5"
                opacity="0.15"
                fill="none"
              />
            </svg>
          </div>

          {userid && (
            <div className="w-full py-10 relative z-10">
              <div className="mx-auto max-w-3xl px-4">
                <h1 className="font-medium text-xl tracking-tight mb-4">
                  Recent Projects
                </h1>
                {isProjectsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-56 w-full rounded-xl" />
                    ))}
                  </div>
                ) : projects && projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projects.map((project: ProjectType) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No projects yet. Create one above!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {isError && <p className="text-red-500 mt-4">Failed to load projects.</p>}
    </>
  );
};

const ProjectCard = memo(({ project }: { project: ProjectType }) => {
  const route = useRouter();
  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    route.push(`/projects/${project.id}`);
  };
  return (
    <div
      role="button"
      className="w-full flex flex-col border rounded-xl cursor-pointer hover:shadow-md overflow-hidden"
      onClick={onRoute}
    >
      <div className="h-40 bg-[#eee] relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
            <img
          src={thumbnail}
          className="w-full h-full object-cover object-left scale-110"
        />
        ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary/50">
              <FolderOpenDotIcon />
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-sm truncate w-full mb-1 line-clamp-1">{project.name}</h3>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  );
});
ProjectCard.displayName = "ProjectCard";
export default LandingSection;
