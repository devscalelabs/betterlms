import { Card, CardContent, CardHeader, CardTitle } from "@betterlms/ui";
import type { Channel } from "../types";

interface ChannelCardProps {
	channel: Channel;
}

export const ChannelCard = ({ channel }: ChannelCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>{channel.name}</span>
					<span className="text-sm font-normal">
						{channel.isPrivate ? "Private" : "Public"}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-sm text-gray-500">
					{channel.members.length} member
					{channel.members.length !== 1 ? "s" : ""}
				</div>
			</CardContent>
		</Card>
	);
};
