import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { MarkAllReadResponse, MarkReadResponse } from "../types";

export const useMarkNotificationRead = () => {
	const queryClient = useQueryClient();

	const markReadMutation = useMutation({
		mutationFn: async (notificationId: string) => {
			const response = await api
				.put<MarkReadResponse>(`api/v1/notifications/${notificationId}/read`)
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			console.error("Failed to mark notification as read:", error);
		},
	});

	const markAllReadMutation = useMutation({
		mutationFn: async () => {
			const response = await api
				.put<MarkAllReadResponse>("api/v1/notifications/read-all")
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			console.error("Failed to mark all notifications as read:", error);
		},
	});

	return {
		markAsRead: markReadMutation.mutate,
		isMarkingRead: markReadMutation.isPending,
		markAllAsRead: markAllReadMutation.mutate,
		isMarkingAllRead: markAllReadMutation.isPending,
	};
};
