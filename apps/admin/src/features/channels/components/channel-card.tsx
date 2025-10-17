import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
	Switch,
} from "@betterlms/ui";
import { useState } from "react";
import { useUpdateChannel } from "../hooks/use-update-channel";
import type { Channel } from "../types";

interface ChannelCardProps {
	channel: Channel;
}

export const ChannelCard = ({ channel }: ChannelCardProps) => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(channel.name);
	const [isPrivate, setIsPrivate] = useState<boolean>(channel.isPrivate);
	const { updateChannel, isUpdatingChannel } = useUpdateChannel();

	const handleSave = () => {
		updateChannel({ id: channel.id, name, isPrivate });
		setOpen(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>{channel.name}</span>
					<div className="flex items-center gap-2">
						<span className="text-sm font-normal">
							{channel.isPrivate ? "Private" : "Public"}
						</span>
						<Button variant="outline" size="sm" onClick={() => setOpen(true)}>
							Edit
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-sm text-gray-500">
					{channel.members.length} member
					{channel.members.length !== 1 ? "s" : ""}
				</div>
			</CardContent>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Channel</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor={`name-${channel.id}`}
								className="text-sm font-medium text-gray-700"
							>
								Name
							</label>
							<Input
								id={`name-${channel.id}`}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id={`priv-${channel.id}`}
								checked={isPrivate}
								onCheckedChange={setIsPrivate}
							/>
							<label
								htmlFor={`priv-${channel.id}`}
								className="text-sm font-medium text-gray-700"
							>
								Private Channel
							</label>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isUpdatingChannel || !name.trim()}
						>
							{isUpdatingChannel ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Card>
	);
};
