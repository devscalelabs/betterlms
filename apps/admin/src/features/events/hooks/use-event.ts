import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { EventResponse } from "../types";

export const useEvent = (id: string) => {
	const { data: eventData, isLoading: isEventLoading } = useQuery({
		queryKey: ["event", id],
		queryFn: () => api.get<EventResponse>(`api/v1/events/${id}/`).json(),
		enabled: !!id,
	});

	return {
		event: eventData?.event,
		isEventLoading,
	};
};
