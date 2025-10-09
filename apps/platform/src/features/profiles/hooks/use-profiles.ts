import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { ProfilesResponse } from "../types";

type UseProfilesOptions = {
	search?: string;
};

export const useProfiles = ({ search }: UseProfilesOptions = {}) => {
	const {
		data: profiles,
		isLoading: isProfilesLoading,
		error,
	} = useQuery({
		queryKey: ["profiles"],
		queryFn: () => api.get<ProfilesResponse>("api/v1/profile/").json(),
	});

	const filteredProfiles = profiles?.users.filter((user) => {
		if (!search || search.trim() === "") return true;
		const searchLower = search.toLowerCase();
		return (
			user.username.toLowerCase().includes(searchLower) ||
			user.name.toLowerCase().includes(searchLower)
		);
	});

	return {
		profiles: filteredProfiles || [],
		isProfilesLoading,
		error,
	};
};
