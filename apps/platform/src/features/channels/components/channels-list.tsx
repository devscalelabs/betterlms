import { Button } from "@betterlms/ui";
import { useQueryState } from "nuqs";
import { useNavigate } from "react-router";
import { useChannels } from "../hooks/use-channels";

export const ChannelsList = () => {
	const { channels, isLoadingChannels } = useChannels();
	const [_, setChannel] = useQueryState("channel");
	const navigate = useNavigate();

	if (isLoadingChannels) {
		return <div>Loading channels...</div>;
	}

	return (
		<div className="space-y-3 ml-3">
			{channels.map((channel) => (
				<Button
					key={channel.id}
					size="xs"
					variant="secondary"
					className="block"
					onClick={() => {
						setChannel(channel.slug);
						navigate("/");
					}}
				>
					{channel.name}
				</Button>
			))}
		</div>
	);
};
