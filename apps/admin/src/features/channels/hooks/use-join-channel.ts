import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";
import type { JoinChannelResponse } from "../types";

interface UseJoinChannelOptions {
	channelId: string;
	onSuccess?: () => void;
}

export const useJoinChannel = ({
	channelId,
	onSuccess,
}: UseJoinChannelOptions) => {
	const queryClient = useQueryClient();

	const { mutate: joinChannel, isPending: isJoiningChannel } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<JoinChannelResponse>(`api/v1/channels/${channelId}/join/`)
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["channels"] });
			queryClient.invalidateQueries({ queryKey: ["channels", channelId] });
			onSuccess?.();
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
