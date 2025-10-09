import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { AppSettingsResponse } from "../types";

export const useAppSettings = () => {
	const {
		data: appSettingsData,
		isLoading: isAppSettingsLoading,
		error,
	} = useQuery({
		queryKey: ["app-settings"],
		queryFn: () => api.get<AppSettingsResponse>("api/v1/app-settings/").json(),
	});

	return {
		appSettings: appSettingsData?.settings,
		isAppSettingsLoading,
		error,
	};
};
