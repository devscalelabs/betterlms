import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupText,
	InputGroupTextarea,
	Separator,
} from "@betterlms/ui";
import { Image01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "@/features/account/hooks/use-account";
import { loginDialogAtom } from "@/features/auth/atoms/login-dialog-atom";
import { useChannels } from "@/features/channels/hooks/use-channels";
import type { Channel } from "@/features/channels/types";
import { MentionDropdown } from "@/features/mentions/components/mention-dropdown";
import { useMention } from "@/features/mentions/hooks/use-mention";
import { useCreatePost } from "../hooks/use-create-post";
import type { Post } from "../types";
import { extractMentions } from "../utils/extract-mentions";

type PostFormProps = {
	parentId?: string;
	replyToPost?: Post;
	onSuccess?: () => void;
};

export const PostForm = ({
	parentId,
	replyToPost,
	onSuccess,
}: PostFormProps) => {
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
	const [initialMentions, setInitialMentions] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { account } = useAccount();
	const { channels } = useChannels();
	const setLoginDialog = useSetAtom(loginDialogAtom);
	const {
		formData,
		setFormData,
		selectedImages,
		handleFileChange,
		removeImage,
		createPost,
		isCreatingPost,
	} = useCreatePost({
		...(parentId && { parentId }),
		...(onSuccess && { onSuccess }),
	});

	const {
		showMentionDropdown,
		mentionSearch,
		cursorCoordinates,
		handleMentionSelect,
		handleContentChange: handleMentionContentChange,
		setShowMentionDropdown,
		setCursorCoordinates,
	} = useMention();

	// Auto-populate mentions when replying
	useEffect(() => {
		if (replyToPost && formData.content === "" && initialMentions === "") {
			const mentionsSet = new Set<string>();

			// Add post author
			if (
				replyToPost.user?.username &&
				replyToPost.user.username !== account?.user?.username
			) {
				mentionsSet.add(replyToPost.user.username);
			}

			// Extract and add mentioned users from content
			const mentionedUsers = extractMentions(replyToPost.content);
			mentionedUsers.forEach((username) => {
				if (username !== account?.user?.username) {
					mentionsSet.add(username);
				}
			});

			// Format mentions
			if (mentionsSet.size > 0) {
				const mentionsText = Array.from(mentionsSet)
					.map((username) => `@${username}`)
					.join(" ");
				setInitialMentions(`${mentionsText} `);
				setFormData((prev) => ({ ...prev, content: `${mentionsText} ` }));
			}
		}
	}, [
		replyToPost,
		account?.user?.username,
		formData.content,
		setFormData,
		initialMentions,
	]);

	const maxLength = formData.content.length;

	function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		let newContent = event.target.value;
		const cursorPosition = event.target.selectionStart;

		// Prevent removing initial mentions when replying
		if (initialMentions && !newContent.startsWith(initialMentions)) {
			// User tried to remove initial mentions, restore them
			const userInput = newContent.replace(initialMentions.trim(), "").trim();
			newContent = `${initialMentions}${userInput}`;

			// Restore cursor position after initial mentions
			setTimeout(() => {
				if (textareaRef.current) {
					textareaRef.current.setSelectionRange(
						initialMentions.length,
						initialMentions.length,
					);
				}
			}, 0);
		}

		setFormData({ ...formData, content: newContent });
		handleMentionContentChange(
			newContent,
			cursorPosition,
			textareaRef.current,
			(content) => setFormData({ ...formData, content }),
		);
	}

	function handleMentionSelectWrapper(username: string) {
		handleMentionSelect(username, formData.content, (content) =>
			setFormData({ ...formData, content }),
		);
		textareaRef.current?.focus();
	}

	function handleTextareaClick() {
		if (!account) {
			setLoginDialog(true);
		}
	}

	function handleTextareaBlur() {
		setTimeout(() => {
			setShowMentionDropdown(false);
			setCursorCoordinates(null);
		}, 200);
	}

	function handleImageSelect() {
		if (!account) {
			setLoginDialog(true);
			return;
		}
		fileInputRef.current?.click();
	}

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		if (!account) {
			setLoginDialog(true);
			return;
		}

		if (formData.content.trim()) {
			const params: { channelId?: string } = {};
			if (selectedChannel?.id) {
				params.channelId = selectedChannel.id;
			}
			createPost(params);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/png,image/jpeg"
				multiple
				onChange={handleFileChange}
				className="hidden"
			/>
			<InputGroup className="border-none shadow-none bg-muted rounded-none relative">
				{showMentionDropdown && (
					<MentionDropdown
						search={mentionSearch}
						onSelect={handleMentionSelectWrapper}
						coordinates={cursorCoordinates}
					/>
				)}
				<InputGroupTextarea
					ref={textareaRef}
					placeholder="Ask, Search or Chat..."
					value={formData.content}
					onChange={handleContentChange}
					onClick={handleTextareaClick}
					onBlur={handleTextareaBlur}
				/>
				<div className="w-full">
					{selectedImages.length > 0 && (
						<div className="flex gap-2 p-3">
							{selectedImages.map((image, index) => (
								<div
									key={`${image.name}-${image.size}-${index}`}
									className="relative"
								>
									<img
										src={URL.createObjectURL(image)}
										alt={`Preview ${index + 1}`}
										className="w-16 h-16 object-cover rounded border"
									/>
									<button
										type="button"
										onClick={() => removeImage(index)}
										className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
									>
										×
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<InputGroupAddon align="block-end">
					<InputGroupButton
						variant="secondary"
						className="rounded-full"
						size="icon-xs"
						type="button"
						onClick={handleImageSelect}
					>
						<HugeiconsIcon icon={Image01FreeIcons} strokeWidth={2} />
					</InputGroupButton>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<InputGroupButton variant="ghost">
								{selectedChannel?.name || "General"}
							</InputGroupButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							side="top"
							align="start"
							className="[--radius:0.95rem]"
						>
							{channels.map((channel) => (
								<DropdownMenuItem
									key={channel.id}
									onClick={() => setSelectedChannel(channel)}
								>
									{channel.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<InputGroupText className="ml-auto">{maxLength}/400</InputGroupText>
					<Separator orientation="vertical" className="!h-4" />
					<Button
						type="submit"
						disabled={isCreatingPost || !formData.content.trim()}
					>
						{isCreatingPost ? "Posting..." : "Post"}
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
};
