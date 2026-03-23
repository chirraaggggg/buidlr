"use client";

import React from "react";
import { useGetProjects } from "../../../../features/use-project";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProjectType } from "../../../../types/project";
import { formatDistanceToNow } from "date-fns";
import { FolderOpenDotIcon, ArrowLeft, Plus } from "lucide-react";

export default function ProjectsPage() {
  const { user } = useKindeBrowserClient();
  const { data: projects, isLoading } = useGetProjects(user?.id);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-sm font-semibold">My Projects</h1>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </Link>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">All Projects</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project: ProjectType) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex w-full flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex h-40 items-center justify-center overflow-hidden bg-muted">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="h-full w-full object-cover object-left transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary/50">
                      <FolderOpenDotIcon />
                    </div>
                  )}
                </div>
                <div className="flex flex-col p-4">
                  <h3 className="mb-1 line-clamp-1 truncate text-sm font-semibold">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FolderOpenDotIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              No projects yet
            </p>
            <Link
              href="/"
              className="text-sm font-semibold text-primary transition hover:underline"
            >
              Create your first project →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
