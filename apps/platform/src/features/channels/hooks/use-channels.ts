import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { ChannelsResponse } from "../types";

export const useChannels = () => {
	const { data: channelsData, isLoading: isLoadingChannels } = useQuery({
		enabled: !!localStorage.getItem("token"),
		queryKey: ["channels"],
		queryFn: () => api.get<ChannelsResponse>("api/v1/channels/").json(),
	});

	return {
		channels: channelsData?.channels || [],
		isLoadingChannels,
	};
};
