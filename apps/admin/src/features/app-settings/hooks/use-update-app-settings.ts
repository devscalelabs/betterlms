import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type {
	UpdateAppSettingsRequest,
	UpdateAppSettingsResponse,
} from "../types";

type UseUpdateAppSettingsOptions = {
	onSuccess?: () => void;
};

export const useUpdateAppSettings = ({
	onSuccess,
}: UseUpdateAppSettingsOptions = {}) => {
	const queryClient = useQueryClient();

	const {
		mutate: updateAppSettings,
		isPending: isUpdatingAppSettings,
		error: updateError,
	} = useMutation({
		mutationFn: async (data: UpdateAppSettingsRequest) => {
			const response = await api
				.put<UpdateAppSettingsResponse>("api/v1/app-settings/", {
					json: data,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["app-settings"] });
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to update app settings:", error);
		},
	});

	return {
		updateAppSettings,
		isUpdatingAppSettings,
		updateError,
	};
};
