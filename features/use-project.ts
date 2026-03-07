import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateProject = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (prompt: string) =>
      await axios
        .post("/api/project", { prompt })
        .then((res) => res.data),
    onSuccess: (data) => {
      router.push(`/projects/${data.data.id}`);
    },
    onError: (error) => {
      console.log("Project failed", error);
      toast.error("Failed to create project");
    },
  });
};

export const useGetProjects = (userId?: string) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/project");
      return res.data.data;
    },
    enabled: !!userId,
  });
};

export const useSaveProject = (projectId: string) => {
  return useMutation({
    mutationFn: async (data: { theme?: string; thumbnail?: string }) => {
      const res = await axios.patch(`/api/project/${projectId}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project saved!");
    },
    onError: () => {
      toast.error("Failed to save project");
    },
  });
};
