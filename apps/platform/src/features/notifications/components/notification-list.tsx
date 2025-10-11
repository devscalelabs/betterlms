import {
  Button,
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
  EmptyHeader,
} from "@betterlms/ui";
import { HeadingBox } from "@/components/shared/heading-box";
import { useMarkNotificationRead } from "../hooks/use-mark-notification-read";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationItem } from "./notification-item";
import { Bell } from "lucide-react";

export const NotificationList = () => {
  const { notifications, unreadCount, isLoadingNotifications } =
    useNotifications();
  const { markAllAsRead, isMarkingAllRead } = useMarkNotificationRead();

  if (isLoadingNotifications) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-border p-4">
            <div className="flex gap-3">
              <div className="size-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header with mark all read button */}
      <HeadingBox>
        {unreadCount > 0 ? (
          <div className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </div>
        ) : (
          <div>Notification</div>
        )}
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? "Marking..." : "Mark all read"}
          </Button>
        )}
      </HeadingBox>

      {/* Notification items */}
      <div className="divide-y divide-border">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      {notifications.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell />
            </EmptyMedia>
            <EmptyTitle>No Notifications</EmptyTitle>
            <EmptyDescription>
              All notifications will appear here when available.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
};
