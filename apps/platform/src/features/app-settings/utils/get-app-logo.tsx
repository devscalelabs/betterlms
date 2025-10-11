import type { AppSettings } from "../types";

interface GetAppLogoProps {
  settings: AppSettings | undefined;
  onLogoClick?: () => void;
  defaultLetter?: string;
  defaultName?: string;
  imgClassName?: string;
  buttonClassName?: string;
}

export const GetAppLogo = ({
  settings,
  onLogoClick,
  defaultLetter = "D",
  defaultName = "BetterLMS",
  imgClassName = "w-full h-16 object-contain",
  buttonClassName = "ml-2 h-14 flex gap-1.5 items-center font-medium pr-4 cursor-pointer w-fit",
}: GetAppLogoProps) => {
  const handleClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  // If appName exists and appLogo exists, use appLogo
  if (settings?.appName && settings?.appLogoUrl) {
    return (
      <img
        src={settings.appLogoUrl}
        alt="App Logo"
        className={imgClassName}
        onClick={handleClick}
        style={{ cursor: onLogoClick ? 'pointer' : 'default' }}
      />
    );
  }

  // If appName exists and no appLogo, use appName
  if (settings?.appName && !settings?.appLogoUrl) {
    const firstLetter = settings.appName.charAt(0).toUpperCase();
    return (
      <button
        type="button"
        className={buttonClassName}
        onClick={handleClick}
      >
        <div className="size-6 flex text-xs items-center justify-center bg-primary text-primary-foreground rounded-md">
          {firstLetter}
        </div>
        <div>{settings.appName}</div>
      </button>
    );
  }

  // Both don't exist, use default
  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick}
    >
      <div className="size-6 flex text-xs items-center justify-center bg-primary text-primary-foreground rounded-md">
        {defaultLetter}
      </div>
      <div>{defaultName}</div>
    </button>
  );
};
