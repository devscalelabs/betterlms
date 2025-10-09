import { Button, Card, Input, Switch } from "@betterlms/ui";
import { useState } from "react";
import { useCreateChannel } from "../hooks/use-create-channel";
import type { CreateChannelRequest } from "../types";

export const ChannelForm = () => {
  const [formData, setFormData] = useState<CreateChannelRequest>({
    name: "",
    isPrivate: false,
  });

  // Generate unique IDs for form elements
  const nameId = "channel-name-" + Math.random().toString(36).substr(2, 9);
  const privateId = "is-private-" + Math.random().toString(36).substr(2, 9);

  const { createChannel, isCreatingChannel } = useCreateChannel({
    onSuccess: () => {
      setFormData({ name: "", isPrivate: false });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      createChannel(formData);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Create New Channel</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium text-gray-700">
            Channel Name
          </label>
          <Input
            id={nameId}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter channel name"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={privateId}
            checked={formData.isPrivate || false}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isPrivate: checked })
            }
          />
          <label htmlFor={privateId} className="text-sm font-medium text-gray-700">
            Private Channel
          </label>
        </div>

        <Button
          type="submit"
          disabled={isCreatingChannel || !formData.name.trim()}
        >
          {isCreatingChannel ? "Creating..." : "Create Channel"}
        </Button>
      </form>
    </Card>
  );
};
