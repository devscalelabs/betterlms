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

export const PostForm = () => {
	return (
		<InputGroup className="border-none shadow-none bg-muted rounded-none ">
			<InputGroupTextarea placeholder="Ask, Search or Chat..." />
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
						<InputGroupButton variant="ghost">General</InputGroupButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						align="start"
						className="[--radius:0.95rem]"
					>
						<DropdownMenuItem>Auto</DropdownMenuItem>
						<DropdownMenuItem>Agent</DropdownMenuItem>
						<DropdownMenuItem>Manual</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<InputGroupText className="ml-auto">52% used</InputGroupText>
				<Separator orientation="vertical" className="!h-4" />
				<Button>Post</Button>
			</InputGroupAddon>
		</InputGroup>
	);
};
