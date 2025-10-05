import { Avatar } from "@betterlms/ui";
import { useProfiles } from "@/features/profiles/hooks/use-profiles";

type MentionDropdownProps = {
	search: string;
	onSelect: (username: string) => void;
	coordinates: { top: number; left: number } | null;
};

export const MentionDropdown = ({
	search,
	onSelect,
	coordinates,
}: MentionDropdownProps) => {
	const { profiles, isProfilesLoading } = useProfiles({ search });

	const style = coordinates
		? {
				position: "absolute" as const,
				top: `${coordinates.top + 24}px`,
				left: `${coordinates.left}px`,
			}
		: undefined;

	if (isProfilesLoading) {
		return (
			<div
				style={style}
				className="w-64 bg-background border rounded-lg shadow-lg p-2 z-50"
			>
				<div className="text-sm text-muted-foreground p-2">Loading...</div>
			</div>
		);
	}

	if (profiles.length === 0) {
		return (
			<div
				style={style}
				className="w-64 bg-background border rounded-lg shadow-lg p-2 z-50"
			>
				<div className="text-sm text-muted-foreground p-2">No users found</div>
			</div>
		);
	}

	return (
		<div
			style={style}
			className="w-64 bg-background border rounded-lg shadow-lg overflow-y-auto z-50"
		>
			{profiles.slice(0, 5).map((profile) => (
				<button
					key={profile.id}
					type="button"
					onClick={() => onSelect(profile.username)}
					className="w-full flex items-center gap-3 p-2 hover:bg-muted transition-colors text-left"
				>
					<Avatar>
						<img
							src={
								profile.imageUrl ||
								`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`
							}
							alt={profile.name}
						/>
					</Avatar>
					<div className="flex-1 min-w-0">
						<div className="text-sm font-medium truncate">{profile.name}</div>
						<div className="text-xs text-muted-foreground truncate">
							@{profile.username}
						</div>
					</div>
				</button>
			))}
		</div>
	);
};
