import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { SuspendUserResponse } from "../types";

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  const { mutate: suspendUser, isPending: isSuspending } = useMutation({
    mutationFn: async (username: string) => {
      const response = await api
        .post<SuspendUserResponse>(`profile/${username}/suspend/`)
        .json();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: (error) => {
      console.error("Failed to suspend user:", error);
    },
  });

  return {
    suspendUser,
    isSuspending,
  };
};
