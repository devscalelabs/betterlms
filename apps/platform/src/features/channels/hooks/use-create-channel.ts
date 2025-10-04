import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import type { CreateChannelRequest, CreateChannelResponse } from "../types";

export const useCreateChannel = () => {
	const [formData, setFormData] = useState<CreateChannelRequest>({
		name: "",
		isPrivate: false,
	});

	const queryClient = useQueryClient();

	const { mutate: createChannel, isPending: isCreatingChannel } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<CreateChannelResponse>("api/v1/channels/", {
					json: formData,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch channels list
			queryClient.invalidateQueries({ queryKey: ["channels"] });
			// Reset form
			setFormData({ name: "", isPrivate: false });
		},
		onError: (error) => {
			console.error("Failed to create channel:", error);
		},
	});

	return {
		formData,
		setFormData,
		createChannel,
		isCreatingChannel,
	};
};
