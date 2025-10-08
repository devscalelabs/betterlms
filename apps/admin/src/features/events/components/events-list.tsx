import { Button, Card } from "@betterlms/ui";
import { Calendar, Globe, MapPin, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useEvents } from "../hooks/use-events";
import type { Event } from "../types";

interface EventsListProps {
  onCreateEvent?: () => void;
}

export const EventsList = ({ onCreateEvent }: EventsListProps) => {
  const navigate = useNavigate();
  const { events, isEventsLoading } = useEvents();

  const handleCreateEvent = () => {
    if (onCreateEvent) {
      onCreateEvent();
    } else {
      navigate("/dashboard/events/create");
    }
  };

  if (isEventsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage your event catalog</p>
        </div>
        <Button onClick={handleCreateEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="mb-4">Get started by creating your first event</p>
              <Button onClick={handleCreateEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: Event) => (
            <Card
              key={event.id}
              className="hover:shadow-md transition-shadow p-6 cursor-pointer"
              onClick={() => navigate(`/dashboard/events/${event.id}/edit`)}
            >
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex gap-1">
                    {event.type === "ONLINE" ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Online
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Offline
                      </span>
                    )}
                  </div>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              <div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {event._count.participants} participants
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  {event.type === "ONLINE" && event.url && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="mr-2 h-4 w-4" />
                      Online Event
                    </div>
                  )}
                  {event.type === "OFFLINE" && (event.city || event.address) && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.city || event.address}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
