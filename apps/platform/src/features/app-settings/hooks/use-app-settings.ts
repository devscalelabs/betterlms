import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { AppSettingsResponse } from "../types";

export const useAppSettings = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["app-settings"],
		queryFn: () => api.get<AppSettingsResponse>("api/v1/app-settings/").json(),
	});

	const settings = data?.settings;

	return {
		settings,
		isLoadingSettings: isLoading,
		settingsError: error,
	};
};
