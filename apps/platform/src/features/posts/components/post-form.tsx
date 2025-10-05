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
import { useRef, useState } from "react";
import { useAccount } from "@/features/account/hooks/use-account";
import { loginDialogAtom } from "@/features/auth/atoms/login-dialog-atom";
import { useChannels } from "@/features/channels/hooks/use-channels";
import type { Channel } from "@/features/channels/types";
import { useCreatePost } from "../hooks/use-create-post";

type PostFormProps = {
	parentId?: string;
	onSuccess?: () => void;
};

export const PostForm = ({ parentId, onSuccess }: PostFormProps) => {
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
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

	const maxLength = formData.content.length;

	function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setFormData({ ...formData, content: event.target.value });
	}

	function handleTextareaClick() {
		if (!account) {
			setLoginDialog(true);
		}
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
			<InputGroup className="border-none shadow-none bg-muted rounded-none ">
				<InputGroupTextarea
					placeholder="Ask, Search or Chat..."
					value={formData.content}
					onChange={handleContentChange}
					onClick={handleTextareaClick}
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
