import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";
import type { CreateChannelRequest, CreateChannelResponse } from "../types";

interface UseCreateChannelOptions {
	onSuccess?: () => void;
}

export const useCreateChannel = ({
	onSuccess,
}: UseCreateChannelOptions = {}) => {
	const queryClient = useQueryClient();

	const { mutate: createChannel, isPending: isCreatingChannel } = useMutation({
		mutationFn: async (data: CreateChannelRequest) => {
			const response = await api
				.post<CreateChannelResponse>("api/v1/channels/", {
					json: data,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["channels"] });
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to create channel:", error);
		},
	});

	return {
		createChannel,
		isCreatingChannel,
	};
};
