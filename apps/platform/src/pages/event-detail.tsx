import { Button, Card } from "@betterlms/ui";
import { ArrowLeft, Calendar, Globe, MapPin, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEvent } from "../features/events/hooks/use-event";

export const EventDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data: event, isLoading, error } = useEvent(id || "");

	if (!id) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Event ID is required</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="p-6 max-w-4xl mx-auto">
				<div className="space-y-6">
					<div className="h-8 bg-muted rounded animate-pulse w-3/4" />
					<div className="space-y-4">
						<div className="h-4 bg-muted rounded animate-pulse" />
						<div className="h-4 bg-muted rounded animate-pulse w-5/6" />
						<div className="h-4 bg-muted rounded animate-pulse w-4/6" />
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="h-20 bg-muted rounded animate-pulse" />
						<div className="h-20 bg-muted rounded animate-pulse" />
					</div>
				</div>
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="p-6 max-w-4xl mx-auto">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Failed to load event</p>
					<Button onClick={() => navigate("/events")} className="mt-4">
						Back to Events
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Events
					</Button>
					<div className="flex gap-2">
						{event.type === "ONLINE" ? (
							<span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
								Online Event
							</span>
						) : (
							<span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
								Offline Event
							</span>
						)}
					</div>
				</div>

				{/* Title and Description */}
				<div className="space-y-4">
					<h1 className="text-3xl font-bold">{event.title}</h1>
					{event.description && (
						<p className="text-lg text-muted-foreground whitespace-pre-wrap">
							{event.description}
						</p>
					)}
				</div>

				{/* Event Details */}
				<div className="grid gap-6 md:grid-cols-2">
					<Card className="p-6">
						<h3 className="text-lg font-semibold mb-4">Event Details</h3>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<Calendar className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="font-medium">Date & Time</p>
									<p className="text-sm text-muted-foreground">
										{new Date(event.date).toLocaleString()}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Users className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="font-medium">Participants</p>
									<p className="text-sm text-muted-foreground">
										{event._count.participants} people attending
									</p>
								</div>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<h3 className="text-lg font-semibold mb-4">Location</h3>
						<div className="space-y-4">
							{event.type === "ONLINE" ? (
								<div className="flex items-center gap-3">
									<Globe className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-medium">Online Event</p>
										{event.url && (
											<a
												href={event.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-blue-600 hover:underline"
											>
												Join Event
											</a>
										)}
									</div>
								</div>
							) : (
								<div className="flex items-center gap-3">
									<MapPin className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-medium">Offline Event</p>
										{event.city && (
											<p className="text-sm text-muted-foreground">
												{event.city}
											</p>
										)}
										{event.address && (
											<p className="text-sm text-muted-foreground">
												{event.address}
											</p>
										)}
									</div>
								</div>
							)}
						</div>
					</Card>
				</div>

				{/* Participants */}
				{event.participants.length > 0 && (
					<Card className="p-6">
						<h3 className="text-lg font-semibold mb-4">
							Participants ({event.participants.length})
						</h3>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{event.participants.map((participant) => (
								<div
									key={participant.userId}
									className="flex items-center gap-3"
								>
									<div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
										{participant.user.name?.[0] || participant.user.username[0]}
									</div>
									<div>
										<p className="font-medium text-sm">
											{participant.user.name || participant.user.username}
										</p>
										<p className="text-xs text-muted-foreground">
											@{participant.user.username}
										</p>
									</div>
								</div>
							))}
						</div>
					</Card>
				)}
			</div>
		</div>
	);
};
