import { Button, Card, Input, Textarea } from "@betterlms/ui";
import { ArrowLeft } from "lucide-react";
import { useId, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/utils/api-client";

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const titleId = useId();
  const descriptionId = useId();
  const typeId = useId();
  const dateId = useId();
  const urlId = useId();
  const cityId = useId();
  const addressId = useId();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "OFFLINE" as "ONLINE" | "OFFLINE",
    date: "",
    url: "",
    city: "",
    address: "",
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
  };

  const handleDescriptionChange = (description: string) => {
    setFormData({ ...formData, description });
  };

  const handleTypeChange = (type: "ONLINE" | "OFFLINE") => {
    setFormData({ ...formData, type });
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date });
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, url });
  };

  const handleCityChange = (city: string) => {
    setFormData({ ...formData, city });
  };

  const handleAddressChange = (address: string) => {
    setFormData({ ...formData, address });
  };

  const isFormValid =
    formData.title.trim().length > 0 && formData.date.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsCreating(true);
    try {
      await api.post("api/v1/events/", { json: formData }).json();
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/events")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Create Event</h1>
            <p className="text-muted-foreground">
              Add a new event to your catalog
            </p>
          </div>

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
                onChange={(e) => handleTitleChange(e.target.value)}
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
                onChange={(e) => handleDescriptionChange(e.target.value)}
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
                  handleTypeChange(e.target.value as "ONLINE" | "OFFLINE")
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
                onChange={(e) => handleDateChange(e.target.value)}
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
                  onChange={(e) => handleUrlChange(e.target.value)}
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
                    onChange={(e) => handleCityChange(e.target.value)}
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
                    onChange={(e) => handleAddressChange(e.target.value)}
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
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isCreating}
            >
              {isCreating ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
