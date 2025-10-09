import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { JoinChannelResponse } from "../types";

export const useJoinChannel = () => {
	const queryClient = useQueryClient();

	const { mutate: joinChannel, isPending: isJoiningChannel } = useMutation({
		mutationFn: async (channelId: string) => {
			const response = await api
				.post<JoinChannelResponse>(`api/v1/channels/${channelId}/join/`)
				.json();
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch channels list
			queryClient.invalidateQueries({ queryKey: ["channels"] });
		},
		onError: (error) => {
			console.error("Failed to join channel:", error);
		},
	});

	return {
		joinChannel,
		isJoiningChannel,
	};
};
