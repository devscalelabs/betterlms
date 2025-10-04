import moment from "moment";

export function getRelativeTime(dateString: string) {
	return moment(dateString).fromNow();
}
