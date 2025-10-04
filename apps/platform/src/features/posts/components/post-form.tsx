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
import { useState } from "react";
import { useChannels } from "@/features/channels/hooks/use-channels";
import type { Channel } from "@/features/channels/types";
import { useCreatePost } from "../hooks/use-create-post";

export const PostForm = () => {
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
	const { channels } = useChannels();
	const { formData, setFormData, createPost, isCreatingPost } = useCreatePost();

	const maxLength = formData.content.length;

	function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setFormData({ ...formData, content: event.target.value });
	}

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		if (formData.content.trim()) {
			createPost(selectedChannel?.id);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<InputGroup className="border-none shadow-none bg-muted rounded-none ">
				<InputGroupTextarea
					placeholder="Ask, Search or Chat..."
					value={formData.content}
					onChange={handleContentChange}
				/>
				<InputGroupAddon align="block-end">
					<InputGroupButton
						variant="outline"
						className="rounded-full"
						size="icon-xs"
					>
						+
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
