import { Button } from "@betterlms/ui";
import { useQueryState } from "nuqs";
import { useChannels } from "../hooks/use-channels";

export const ChannelsList = () => {
	const { channels, isLoadingChannels } = useChannels();
	const [_, setChannel] = useQueryState("channel");

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
					onClick={() => setChannel(channel.slug)}
				>
					{channel.name}
				</Button>
			))}
		</div>
	);
};
