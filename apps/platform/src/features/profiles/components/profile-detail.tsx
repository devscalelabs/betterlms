import { getUserInitials } from "@betterlms/common/strings";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@betterlms/ui";
import { useNavigate, useParams } from "react-router";
import { HeadingBox } from "@/components/shared/heading-box";
import { useProfile } from "../hooks/use-profile";

export const ProfileDetail = () => {
	const navigate = useNavigate();
	const { username } = useParams<{ username: string }>();
	const { profile, isProfileLoading, error } = useProfile(username || "");

	if (isProfileLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">Loading profile...</p>
			</div>
		);
	}

	if (error || !profile?.user) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">User not found</p>
			</div>
		);
	}

	const user = profile.user;

	return (
		<div>
			<HeadingBox>
				<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
					Back
				</Button>
				<div></div>
			</HeadingBox>
			{/* Profile Header */}
			<div className="border-b border-border p-6">
				<div className="flex items-start gap-4">
					<Avatar className="size-20">
						<AvatarImage src={user.imageUrl || ""} alt={user.name} />
						<AvatarFallback className="text-2xl">
							{getUserInitials(user.name)}
						</AvatarFallback>
					</Avatar>

					<div className="flex-1">
						<h1 className="text-2xl font-bold">{user.name}</h1>
						<p className="text-muted-foreground">@{user.username}</p>

						{user.bio && (
							<p className="mt-3 text-sm leading-relaxed">{user.bio}</p>
						)}

						<div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
							<span>{user.email}</span>
							<span className="capitalize">{user.role}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
