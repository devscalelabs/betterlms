import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { EventsResponse } from "../types";

export const useEvents = () => {
	return useQuery({
		queryKey: ["events"],
		queryFn: async () => {
			const response = await api.get<EventsResponse>("api/v1/events/").json();
			return response.events;
		},
	});
};
