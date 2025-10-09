import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  const { mutate: unfollowUser, isPending: isUnfollowing } = useMutation({
    mutationFn: async (username: string) => {
      const response = await api
        .delete(`profile/${username}/follow/`)
        .json();
      return response;
    },
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
    onError: (error) => {
      console.error("Failed to unfollow user:", error);
    },
  });

  return {
    unfollowUser,
    isUnfollowing,
  };
};
