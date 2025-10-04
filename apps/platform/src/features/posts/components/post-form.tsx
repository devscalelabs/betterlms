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

export const PostForm = () => {
	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
	const { channels } = useChannels();
	const [maxLength, setMaxLength] = useState(400);

	function handleMaxLength(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setMaxLength(event.target.value.length);
	}

	return (
		<InputGroup className="border-none shadow-none bg-muted rounded-none ">
			<InputGroupTextarea
				placeholder="Ask, Search or Chat..."
				onChange={handleMaxLength}
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
				<Button>Post</Button>
			</InputGroupAddon>
		</InputGroup>
	);
};
