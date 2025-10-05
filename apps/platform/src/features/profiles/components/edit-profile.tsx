import { getUserInitials } from "@betterlms/common/strings";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Input,
	Textarea,
} from "@betterlms/ui";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { HeadingBox } from "@/components/shared/heading-box";
import { useAccount } from "@/features/account/hooks/use-account";
import { useUpdateProfile } from "../hooks/use-update-profile";

const nameId = "edit-profile-name";
const bioId = "edit-profile-bio";
const emailId = "edit-profile-email";

export const EditProfile = () => {
	const navigate = useNavigate();
	const { account } = useAccount();
	const { updateProfile, isUpdating } = useUpdateProfile();

	const [name, setName] = useState(account?.user.name || "");
	const [bio, setBio] = useState(account?.user.bio || "");
	const [avatarPreview, setAvatarPreview] = useState(
		account?.user.imageUrl || "",
	);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const updateData: {
			name?: string;
			bio?: string;
			avatar?: File;
		} = {};

		if (name !== account?.user.name) {
			updateData.name = name;
		}
		if (bio !== account?.user.bio) {
			updateData.bio = bio;
		}
		if (avatarFile) {
			updateData.avatar = avatarFile;
		}

		updateProfile(updateData, {
			onSuccess: () => {
				navigate(`/profile/${account?.user.username}`);
			},
		});
	};

	if (!account?.user) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<div>
			<HeadingBox>
				<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
					Cancel
				</Button>
				<Button size="sm" onClick={handleSubmit} disabled={isUpdating}>
					{isUpdating ? "Saving..." : "Save"}
				</Button>
			</HeadingBox>

			<form onSubmit={handleSubmit} className="p-6">
				<div className="space-y-6">
					{/* Avatar Section */}
					<div className="flex items-center gap-4">
						<Avatar className="size-20">
							<AvatarImage src={avatarPreview} alt={account.user.name} />
							<AvatarFallback className="text-2xl">
								{getUserInitials(account.user.name)}
							</AvatarFallback>
						</Avatar>
						<div>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleAvatarChange}
								className="hidden"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
							>
								Change Avatar
							</Button>
						</div>
					</div>

					{/* Name Field */}
					<div className="space-y-2">
						<label htmlFor={nameId} className="text-sm font-medium">
							Name
						</label>
						<Input
							id={nameId}
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							maxLength={100}
						/>
					</div>

					{/* Bio Field */}
					<div className="space-y-2">
						<label htmlFor={bioId} className="text-sm font-medium">
							Bio
						</label>
						<Textarea
							id={bioId}
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							placeholder="Tell us about yourself"
							maxLength={500}
							rows={4}
						/>
						<p className="text-xs text-muted-foreground">
							{bio.length}/500 characters
						</p>
					</div>

					{/* Email Field (Read-only) */}
					<div className="space-y-2">
						<label htmlFor={emailId} className="text-sm font-medium">
							Email
						</label>
						<Input
							id={emailId}
							type="email"
							value={account.user.email}
							disabled
							className="bg-muted"
						/>
						<p className="text-xs text-muted-foreground">
							Email cannot be changed
						</p>
					</div>
				</div>
			</form>
		</div>
	);
};
