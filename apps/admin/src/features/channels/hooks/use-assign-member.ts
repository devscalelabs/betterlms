import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";

export const useAssignMember = () => {
	const queryClient = useQueryClient();

	const { mutate: addMember, isPending: isAdding } = useMutation({
		mutationFn: async ({
			channelId,
			userId,
		}: {
			channelId: string;
			userId: string;
		}) => {
			await api.post(`api/v1/channels/${channelId}/members/`, {
				json: { userId },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["channels"] });
		},
	});

	const { mutate: removeMember, isPending: isRemoving } = useMutation({
		mutationFn: async ({
			channelId,
			userId,
		}: {
			channelId: string;
			userId: string;
		}) => {
			await api.delete(`api/v1/channels/${channelId}/members/${userId}/`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["channels"] });
		},
	});

	return { addMember, removeMember, isAdding, isRemoving };
};
