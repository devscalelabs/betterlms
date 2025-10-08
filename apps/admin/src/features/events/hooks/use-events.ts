import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { EventsResponse } from "../types";

export const useEvents = () => {
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => api.get<EventsResponse>("api/v1/events/").json(),
  });

  return {
    events: eventsData?.events || [],
    isEventsLoading,
  };
};
