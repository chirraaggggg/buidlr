import { Frame } from "@/generated/prisma/client";

export type ProjectType = {
    id: string;
    name: string;
    theme: string;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
    frames: FrameType[];
};
export type FrameType = {
    id: string;
    title: string;
    htmlContent: string;
    projectId?: string;
    createdAt: string;
    updatedAt?: string;

    isLoading?: boolean;
};