import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";
import type { ChannelResponse } from "../types";

interface UseChannelOptions {
	id: string;
}

export const useChannel = ({ id }: UseChannelOptions) => {
	const { data: channelData, isLoading: isLoadingChannel } = useQuery({
		queryKey: ["channels", id],
		queryFn: () => {
			return api.get<ChannelResponse>(`api/v1/channels/${id}`).json();
		},
		enabled: !!id,
	});

	return {
		channel: channelData?.channel,
		isLoadingChannel,
	};
};
