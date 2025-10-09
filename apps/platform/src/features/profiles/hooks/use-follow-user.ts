import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";

export const useFollowUser = () => {
	const queryClient = useQueryClient();

	const { mutate: followUser, isPending: isFollowing } = useMutation({
		mutationFn: async (username: string) => {
			const response = await api
				.post(`api/v1/profile/${username}/follow/`)
				.json();
			return response;
		},
		onSuccess: (_, username) => {
			queryClient.invalidateQueries({ queryKey: ["profile", username] });
		},
		onError: (error) => {
			console.error("Failed to follow user:", error);
		},
	});

	return {
		followUser,
		isFollowing,
	};
};
