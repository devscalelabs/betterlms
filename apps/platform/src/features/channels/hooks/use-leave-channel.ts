import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { LeaveChannelResponse } from "../types";

export const useLeaveChannel = () => {
	const queryClient = useQueryClient();

	const { mutate: leaveChannel, isPending: isLeavingChannel } = useMutation({
		mutationFn: async (channelId: string) => {
			const response = await api
				.delete<LeaveChannelResponse>(`api/v1/channels/${channelId}/leave`)
				.json();
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch channels list
			queryClient.invalidateQueries({ queryKey: ["channels"] });
		},
		onError: (error) => {
			console.error("Failed to leave channel:", error);
		},
	});

	return {
		leaveChannel,
		isLeavingChannel,
	};
};
