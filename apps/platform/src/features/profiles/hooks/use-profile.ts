import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { ProfileResponse } from "../types";

export const useProfile = (username: string) => {
	const {
		data: profile,
		isLoading: isProfileLoading,
		error,
	} = useQuery({
		queryKey: ["profile", username],
		queryFn: () =>
			api.get<ProfileResponse>(`api/v1/profile/${username}/`).json(),
	});

	return { profile, isProfileLoading, error };
};
