import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";

export const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) =>
			api.delete(`api/v1/events/${id}/`).then(() => ({ success: true })),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};
