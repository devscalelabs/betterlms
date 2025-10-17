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
import { useProfiles } from "../../profiles/hooks/use-profiles";
import { useAssignMember } from "../hooks/use-assign-member";
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
	const { addMember, removeMember, isAdding, isRemoving } = useAssignMember();
	const { profiles, isProfilesLoading } = useProfiles();

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
				<div className="space-y-4">
					<div className="text-sm text-gray-500">
						{channel.members.length} member
						{channel.members.length !== 1 ? "s" : ""}
					</div>
					{channel.isPrivate && (
						<fieldset>
							<legend
								id={`members-label-${channel.id}`}
								className="text-sm font-medium text-gray-700"
							>
								Members
							</legend>
							<ul className="mt-2 space-y-2">
								{channel.members.map((m) => (
									<li key={m.id} className="flex items-center justify-between">
										<span className="text-sm text-gray-800">
											{m.user?.name || m.userId}
											{m.user?.username ? ` (@${m.user.username})` : ""}
										</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												removeMember({
													channelId: channel.id,
													userId: m.userId,
												})
											}
											disabled={isRemoving}
										>
											Remove
										</Button>
									</li>
								))}
								{channel.members.length === 0 && (
									<li className="text-sm text-gray-500">No members</li>
								)}
							</ul>
						</fieldset>
					)}
					{channel.isPrivate && (
						<div className="pt-2">
							<label
								htmlFor={`add-${channel.id}`}
								className="text-sm font-medium text-gray-700"
							>
								Add user
							</label>
							<div className="mt-2 flex items-center gap-2">
								<select
									id={`add-${channel.id}`}
									className="border border-gray-200 rounded px-2 py-1 text-sm"
									disabled={isProfilesLoading || isAdding}
									onChange={(e) => {
										const userId = e.target.value;
										if (userId) {
											addMember({ channelId: channel.id, userId });
											e.currentTarget.selectedIndex = 0;
										}
									}}
								>
									<option value="">Select user…</option>
									{profiles.map((u) => (
										<option key={u.id} value={u.id}>
											{u.name} (@{u.username})
										</option>
									))}
								</select>
								<Button variant="outline" size="sm" disabled>
									Add
								</Button>
							</div>
						</div>
					)}
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
