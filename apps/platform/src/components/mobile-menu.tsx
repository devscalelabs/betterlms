import { Button } from "@betterlms/ui";
import {
  Notification01FreeIcons,
  TissuePaperFreeIcons,
  User02FreeIcons,
  Video01FreeIcons,
  ZapFreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSetAtom } from "jotai";
import { useQueryState } from "nuqs";
import { useNavigate } from "react-router";
import { useAccount } from "@/features/account/hooks/use-account";
import { loginDialogAtom } from "@/features/auth/atoms/login-dialog-atom";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";

export const MobileMenu = () => {
  const navigate = useNavigate();
  const [_, setChannel] = useQueryState("channel");
  const { unreadCount } = useNotifications();
  const { account } = useAccount();
  const setLoginDialog = useSetAtom(loginDialogAtom);

  const handleNavigation = (callback: () => void) => {
    callback();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          onClick={() =>
            handleNavigation(() => {
              setChannel(null);
              navigate("/");
            })
          }
        >
          <HugeiconsIcon icon={ZapFreeIcons} size={20} />
          <span className="text-xs">Timeline</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          onClick={() => handleNavigation(() => navigate("/articles"))}
        >
          <HugeiconsIcon icon={TissuePaperFreeIcons} size={20} />
          <span className="text-xs">Articles</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          onClick={() => handleNavigation(() => navigate("/courses"))}
        >
          <HugeiconsIcon icon={Video01FreeIcons} size={20} />
          <span className="text-xs">Courses</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative"
          onClick={() => handleNavigation(() => navigate("/notifications"))}
        >
          <div className="relative">
            <HugeiconsIcon icon={Notification01FreeIcons} size={20} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 border border-emerald-400 w-4 h-4 text-xs font-bold bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </div>
            )}
          </div>
          <span className="text-xs">Alerts</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          onClick={() =>
            handleNavigation(() => {
              if (!account) {
                setLoginDialog(true);
              } else {
                navigate(`/profile/${account.user.username}`);
              }
            })
          }
        >
          <HugeiconsIcon icon={User02FreeIcons} size={20} />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </nav>
  );
};
