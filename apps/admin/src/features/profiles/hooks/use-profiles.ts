import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { ProfilesResponse } from "../types";

export const useProfiles = () => {
	const {
		data: profilesData,
		isLoading: isProfilesLoading,
		error,
	} = useQuery({
		queryKey: ["profiles"],
		queryFn: () => api.get<ProfilesResponse>("api/v1/profile/").json(),
	});

	return {
		profiles: profilesData?.users || [],
		isProfilesLoading,
		error,
	};
};
