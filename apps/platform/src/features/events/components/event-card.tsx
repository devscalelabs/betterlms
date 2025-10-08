import { Card } from "@betterlms/ui";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import type { Event } from "../types";

interface EventCardProps {
	event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/events/${event.id}`);
	};

	const isPastEvent = new Date(event.date) < new Date();
	const isUpcomingEvent = new Date(event.date) > new Date();

	return (
		<Card
			className={twMerge(
				"p-4 cursor-pointer -space-y-4",
				isPastEvent && "opacity-50",
			)}
			onClick={handleClick}
		>
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold line-clamp-1 flex-1 mr-2">
					{event.title}
				</h3>
				{isUpcomingEvent && (
					<span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
						Coming
					</span>
				)}
			</div>
			<div className="flex items-center text-xs text-muted-foreground">
				<Calendar className="mr-1 h-3 w-3" />
				{new Date(event.date).toLocaleDateString()}
			</div>
		</Card>
	);
};
