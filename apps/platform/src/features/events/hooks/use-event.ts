import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { EventResponse } from "../types";

export const useEvent = (id: string) => {
	return useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			const response = await api
				.get<EventResponse>(`api/v1/events/${id}/`)
				.json();
			return response.event;
		},
		enabled: !!id,
	});
};
