import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";
import type { Channel, ChannelResponse } from "../types";

export interface UpdateChannelRequest {
	id: string;
	name?: string;
	isPrivate?: boolean;
}

export const useUpdateChannel = () => {
	const queryClient = useQueryClient();

	const { mutate: updateChannel, isPending: isUpdatingChannel } = useMutation({
		mutationFn: async ({ id, ...data }: UpdateChannelRequest) => {
			const response = await api
				.put<ChannelResponse>(`api/v1/channels/${id}/`, { json: data })
				.json();
			return response.channel as Channel;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["channels"] });
		},
		onError: (error) => {
			console.error("Failed to update channel:", error);
		},
	});

	return { updateChannel, isUpdatingChannel };
};
