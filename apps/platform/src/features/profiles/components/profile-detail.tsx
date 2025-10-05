import { getUserInitials } from "@betterlms/common/strings";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@betterlms/ui";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { HeadingBox } from "@/components/shared/heading-box";
import { useAccount } from "@/features/account/hooks/use-account";
import { PostCard } from "@/features/posts/components/post-card";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { usePostsFilter } from "@/features/posts/hooks/use-posts-filter";
import { useFollowUser } from "../hooks/use-follow-user";
import { useProfile } from "../hooks/use-profile";
import { useUnfollowUser } from "../hooks/use-unfollow-user";

export const ProfileDetail = () => {
	const navigate = useNavigate();
	const { username } = useParams<{ username: string }>();
	const { account } = useAccount();
	const { profile, isProfileLoading, error } = useProfile(username || "");
	const filters = usePostsFilter({ username: username || "" });
	const { posts, isLoadingPosts } = usePosts(filters);
	const [activeTab, setActiveTab] = useState<"posts" | "replies">("posts");
	const { followUser, isFollowing } = useFollowUser();
	const { unfollowUser, isUnfollowing } = useUnfollowUser();

	const isOwnProfile = account?.user.username === username;

	const handleFollowToggle = () => {
		if (!username) return;

		if (profile?.user.isFollowing) {
			unfollowUser(username);
		} else {
			followUser(username);
		}
	};

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

	const userPosts = posts.filter((post) => !post.parentId);
	const userReplies = posts.filter((post) => post.parentId);

	return (
		<div>
			<HeadingBox>
				<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
					Back
				</Button>
				{isOwnProfile ? (
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate("/profile/edit")}
					>
						Edit Profile
					</Button>
				) : (
					<Button
						variant={profile?.user.isFollowing ? "outline" : "default"}
						size="sm"
						onClick={handleFollowToggle}
						disabled={isFollowing || isUnfollowing}
					>
						{isFollowing || isUnfollowing
							? "Loading..."
							: profile?.user.isFollowing
								? "Unfollow"
								: "Follow"}
					</Button>
				)}
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
						{user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="border-b border-border">
				<div className="flex">
					<button
						type="button"
						onClick={() => setActiveTab("posts")}
						className={`flex-1 py-4 text-sm font-medium transition-colors ${
							activeTab === "posts"
								? "border-b-2 border-primary text-foreground"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Posts
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("replies")}
						className={`flex-1 py-4 text-sm font-medium transition-colors ${
							activeTab === "replies"
								? "border-b-2 border-primary text-foreground"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Replies
					</button>
				</div>
			</div>

			{/* Tab Content */}
			<div>
				{isLoadingPosts ? (
					<div className="flex items-center justify-center p-8">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				) : activeTab === "posts" ? (
					userPosts.length > 0 ? (
						<div>
							{userPosts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="flex items-center justify-center p-8">
							<p className="text-muted-foreground">No posts yet</p>
						</div>
					)
				) : userReplies.length > 0 ? (
					<div>
						{userReplies.map((reply) => (
							<PostCard key={reply.id} post={reply} />
						))}
					</div>
				) : (
					<div className="flex items-center justify-center p-8">
						<p className="text-muted-foreground">No replies yet</p>
					</div>
				)}
			</div>
		</div>
	);
};
