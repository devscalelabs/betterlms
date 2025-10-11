import { getUserInitials } from "@betterlms/common/strings";
import { Avatar, AvatarFallback, AvatarImage } from "@betterlms/ui";
import type { Post } from "../types";

interface CommentPreviewProps {
  commentPreview: Post["commentPreview"];
}

export const CommentPreview = ({ commentPreview }: CommentPreviewProps) => {
  if (!commentPreview || commentPreview.totalCount === 0) {
    return null;
  }

  const { users, totalCount } = commentPreview;

  const getCommentText = () => {
    if (users.length === 0) {
      return `${totalCount} ${totalCount === 1 ? "person" : "people"} commented`;
    }

    const firstUser = users[0];
    if (!firstUser) {
      return `${totalCount} ${totalCount === 1 ? "person" : "people"} commented`;
    }

    const firstName = firstUser.username;
    const remaining = totalCount - 1;

    if (remaining === 0) {
      return `${firstName} commented`;
    }

    return `${firstName} and ${remaining} other ${remaining === 1 ? "person" : "people"} commented`;
  };

  return (
    <div className="flex items-center gap-2 ">
      {users.length > 0 && (
        <div className="flex -space-x-2">
          {users.map((user) => (
            <Avatar key={user.id} className="size-8 ">
              <AvatarImage src={user.imageUrl || ""} alt={user.name} />
              <AvatarFallback className="text-xs">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}
      <span className="text-xs text-muted-foreground">{getCommentText()}</span>
    </div>
  );
};
