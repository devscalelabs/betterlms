import { Button, Card, Input, Textarea } from "@betterlms/ui";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDeleteEvent } from "../hooks/use-delete-event";
import { useEvent } from "../hooks/use-event";
import { useUpdateEvent } from "../hooks/use-update-event";

export const EditEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const titleId = useId();
  const descriptionId = useId();
  const typeId = useId();
  const dateId = useId();
  const urlId = useId();
  const cityId = useId();
  const addressId = useId();

  const { event, isEventLoading } = useEvent(id || "");
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "OFFLINE" as "ONLINE" | "OFFLINE",
    date: "",
    url: "",
    city: "",
    address: "",
  });

  const isFormValid =
    formData.title.trim().length > 0 && formData.date.trim().length > 0;

  // Populate form with event data
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        type: event.type,
        date: new Date(event.date).toISOString().slice(0, 16),
        url: event.url || "",
        city: event.city || "",
        address: event.address || "",
      });
    }
  }, [event]);

  const handleUpdate = () => {
    if (!id || !isFormValid) return;

    updateEvent.mutate(
      {
        id,
        data: {
          title: formData.title,
          description: formData.description || null,
          type: formData.type,
          date: formData.date,
          url: formData.url || null,
          city: formData.city || null,
          address: formData.address || null,
        },
      },
      {
        onSuccess: () => {
          navigate("/dashboard/events");
        },
      },
    );
  };

  const handleDelete = () => {
    if (!id) return;

    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(id, {
        onSuccess: () => {
          navigate("/dashboard/events");
        },
      });
    }
  };

  if (isEventLoading) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading event...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Button
            onClick={() => navigate("/dashboard/events")}
            className="mt-4"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/events")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Event</h1>
            <p className="text-muted-foreground">Update event details</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteEvent.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor={titleId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <Input
                id={titleId}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label
                htmlFor={descriptionId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <Textarea
                id={descriptionId}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div>
              <label
                htmlFor={typeId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type *
              </label>
              <select
                id={typeId}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "ONLINE" | "OFFLINE" })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="OFFLINE">Offline</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={dateId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date & Time *
              </label>
              <Input
                id={dateId}
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {formData.type === "ONLINE" && (
              <div>
                <label
                  htmlFor={urlId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event URL
                </label>
                <Input
                  id={urlId}
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}

            {formData.type === "OFFLINE" && (
              <>
                <div>
                  <label
                    htmlFor={cityId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    City
                  </label>
                  <Input
                    id={cityId}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label
                    htmlFor={addressId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address
                  </label>
                  <Input
                    id={addressId}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/events")}
              disabled={updateEvent.isPending || deleteEvent.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                !isFormValid || updateEvent.isPending || deleteEvent.isPending
              }
            >
              {updateEvent.isPending ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
