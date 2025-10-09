import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";

interface UseLeaveChannelOptions {
  channelId: string;
  onSuccess?: () => void;
}

export const useLeaveChannel = ({ channelId, onSuccess }: UseLeaveChannelOptions) => {
  const queryClient = useQueryClient();

  const { mutate: leaveChannel, isPending: isLeavingChannel } = useMutation({
    mutationFn: async () => {
      const response = await api
        .delete(`api/v1/channels/${channelId}/leave`)
        .json();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      queryClient.invalidateQueries({ queryKey: ["channels", channelId] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to leave channel:", error);
    },
  });

  return {
    leaveChannel,
    isLeavingChannel,
  };
};
