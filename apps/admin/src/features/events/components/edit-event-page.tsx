import { Button, Card, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@betterlms/ui";
import { ArrowLeft } from "lucide-react";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useCreateEvent } from "../hooks/use-create-event";

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const titleId = useId();
  const descriptionId = useId();
  const typeId = useId();
  const dateId = useId();
  const urlId = useId();
  const cityId = useId();
  const addressId = useId();

  const {
    formData,
    handleTitleChange,
    handleDescriptionChange,
    handleTypeChange,
    handleDateChange,
    handleUrlChange,
    handleCityChange,
    handleAddressChange,
    createEvent,
    isCreatingEvent,
    isFormValid,
  } = useCreateEvent({
    onSuccess: () => {
      navigate("/dashboard/events");
    },
  });

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
              <Label htmlFor={titleId}>Title *</Label>
              <Input
                id={titleId}
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <Label htmlFor={descriptionId}>Description</Label>
              <Textarea
                id={descriptionId}
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor={typeId}>Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "ONLINE" | "OFFLINE") => handleTypeChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={dateId}>Date & Time *</Label>
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
                <Label htmlFor={urlId}>Event URL</Label>
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
                  <Label htmlFor={cityId}>City</Label>
                  <Input
                    id={cityId}
                    value={formData.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor={addressId}>Address</Label>
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
              disabled={isCreatingEvent}
            >
              Cancel
            </Button>
            <Button
              onClick={() => createEvent()}
              disabled={!isFormValid || isCreatingEvent}
            >
              {isCreatingEvent ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
