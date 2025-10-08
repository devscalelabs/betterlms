import { HeadingBox } from "@/components/shared/heading-box";
import { EventList } from "@/features/events/components/event-list";

export const EventsPage = () => {
	return (
		<main>
			<HeadingBox>
				<div>Events</div>
				<div></div>
			</HeadingBox>
			<EventList />
		</main>
	);
};
