import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { UpdateEventRequest, UpdateEventResponse } from "../types";

export const useUpdateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
			api
				.put<UpdateEventResponse>(`api/v1/events/${id}/`, { json: data })
				.json(),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.invalidateQueries({ queryKey: ["event", id] });
		},
	});
};
