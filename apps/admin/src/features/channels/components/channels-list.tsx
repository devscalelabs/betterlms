import { useChannels } from "../hooks/use-channels";
import { ChannelCard } from "./channel-card";
import { ChannelForm } from "./channel-form";

export const ChannelsList = () => {
  const { channels, isLoadingChannels } = useChannels();

  if (isLoadingChannels) {
    return <div>Loading channels...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Channels Management</h2>
        <p className="text-gray-600">Manage all channels in the system</p>
      </div>

      <ChannelForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>

      {channels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No channels found</p>
        </div>
      )}
    </div>
  );
};
