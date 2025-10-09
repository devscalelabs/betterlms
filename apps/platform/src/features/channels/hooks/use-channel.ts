import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { ChannelResponse } from "../types";

export const useChannel = (channelId: string) => {
	const { data: channelData, isLoading: isLoadingChannel } = useQuery({
		enabled: !!localStorage.getItem("token") && !!channelId,
		queryKey: ["channel", channelId],
		queryFn: () =>
			api.get<ChannelResponse>(`api/v1/channels/${channelId}/`).json(),
	});

	return {
		channel: channelData?.channel,
		isLoadingChannel,
	};
};
