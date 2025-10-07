import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { NotificationsResponse } from "../types";

export const useNotifications = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<NotificationsResponse>("api/v1/notifications/").json(),
    enabled: !!localStorage.getItem("token"),
  });

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoadingNotifications: isLoading,
    notificationsError: error,
  };
};
