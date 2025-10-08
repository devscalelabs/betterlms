import { Card } from "@betterlms/ui";
import { useEvents } from "../hooks/use-events";
import { EventCard } from "./event-card";

export const EventList = () => {
	const { data: events, isLoading, error } = useEvents();

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Card key={i} className="p-6">
							<div className="space-y-4">
								<div className="flex items-start justify-between">
									<div className="h-6 bg-muted rounded animate-pulse w-3/4" />
									<div className="h-5 bg-muted rounded animate-pulse w-16" />
								</div>
								<div className="space-y-2">
									<div className="h-4 bg-muted rounded animate-pulse" />
									<div className="h-4 bg-muted rounded animate-pulse w-5/6" />
								</div>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 bg-muted rounded animate-pulse" />
										<div className="h-4 bg-muted rounded animate-pulse w-20" />
									</div>
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 bg-muted rounded animate-pulse" />
										<div className="h-4 bg-muted rounded animate-pulse w-24" />
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Failed to load events</p>
			</div>
		);
	}

	if (!events || events.length === 0) {
		return (
			<Card className="p-6">
				<div className="flex flex-col items-center justify-center py-12">
					<div className="text-muted-foreground text-center">
						<h3 className="text-lg font-semibold mb-2">No events available</h3>
						<p>Check back later for upcoming events</p>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 p-6">
			{events.map((event) => (
				<EventCard key={event.id} event={event} />
			))}
		</div>
	);
};
