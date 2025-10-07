import { getRelativeTime } from "@betterlms/common/date";
import { getUserInitials } from "@betterlms/common/strings";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@betterlms/ui";
import { useNavigate } from "react-router";
import { useMarkNotificationRead } from "../hooks/use-mark-notification-read";
import type { Notification } from "../types";

interface NotificationItemProps {
	notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
	const navigate = useNavigate();
	const { markAsRead, isMarkingRead } = useMarkNotificationRead();

	const handleMarkAsRead = (e: React.MouseEvent) => {
		e.stopPropagation();
		markAsRead(notification.id);
	};

	const handleClick = () => {
		// Mark as read if not already read
		if (!notification.isRead) {
			markAsRead(notification.id);
		}

		// Navigate based on notification type
		if (notification.postId) {
			navigate(`/post/${notification.postId}`);
		} else if (notification.actorId) {
			navigate(`/profile/${notification.actor?.username}`);
		}
	};

	const getNotificationIcon = () => {
		switch (notification.type) {
			case "MENTION":
				return "💬";
			case "LIKE":
				return "❤️";
			case "FOLLOW":
				return "👤";
			case "COMMENT":
				return "💭";
			case "COURSE_ENROLLMENT":
				return "📚";
			case "COURSE_COMPLETION":
				return "🎉";
			default:
				return "📢";
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={`w-full p-4 border-b border-border text-left hover:bg-muted/50 transition-colors ${
				!notification.isRead ? "bg-blue-50/50" : ""
			}`}
		>
			<div className="flex gap-3">
				{/* Avatar with notification icon overlay */}
				<div className="relative">
					<Avatar className="size-10">
						<AvatarImage
							src={notification.actor?.imageUrl || ""}
							alt={notification.actor?.name || ""}
						/>
						<AvatarFallback>
							{notification.actor
								? getUserInitials(notification.actor.name)
								: "?"}
						</AvatarFallback>
					</Avatar>
					<div className="absolute -bottom-1 -right-1 size-5 bg-background rounded-full flex items-center justify-center text-xs">
						{getNotificationIcon()}
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between">
						<div className="flex-1 min-w-0">
							<p className="text-sm text-foreground leading-relaxed">
								{notification.message}
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{getRelativeTime(notification.createdAt)}
							</p>
						</div>

						{/* Mark as read button */}
						{!notification.isRead && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleMarkAsRead}
								disabled={isMarkingRead}
								className="ml-2 text-xs opacity-70 hover:opacity-100"
							>
								{isMarkingRead ? "..." : "Mark read"}
							</Button>
						)}
					</div>
				</div>
			</div>
		</button>
	);
};
