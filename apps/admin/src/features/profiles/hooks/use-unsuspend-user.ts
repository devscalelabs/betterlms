import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { SuspendUserResponse } from "../types";

export const useUnsuspendUser = () => {
  const queryClient = useQueryClient();

  const { mutate: unsuspendUser, isPending: isUnsuspending } = useMutation({
    mutationFn: async (username: string) => {
      const response = await api
        .delete<SuspendUserResponse>(`profile/${username}/suspend/`)
        .json();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: (error) => {
      console.error("Failed to unsuspend user:", error);
    },
  });

  return {
    unsuspendUser,
    isUnsuspending,
  };
};
