import { Button } from "@betterlms/ui";
import { useChannels } from "../hooks/use-channels";

export const ChannelsList = () => {
	const { channels, isLoadingChannels } = useChannels();

	if (isLoadingChannels) {
		return <div>Loading channels...</div>;
	}

	return (
		<div className="space-y-2 ml-3">
			{channels.map((channel) => (
				<Button
					key={channel.id}
					size="xs"
					variant="secondary"
					className="w-fit block"
				>
					{channel.name}
				</Button>
			))}
		</div>
	);
};
