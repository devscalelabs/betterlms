import { useQueryState } from "nuqs";

interface PostsFilterOptions {
	parentId?: string;
	username?: string;
	channelSlug?: string;
}

export const usePostsFilter = (defaultFilters?: PostsFilterOptions) => {
	const [parentId] = useQueryState("parentId");
	const [username] = useQueryState("username");
	const [channelSlug] = useQueryState("channel");

	const buildFilters = (): PostsFilterOptions | undefined => {
		const filters: PostsFilterOptions = {};

		// Priority: defaultFilters > query params
		const finalParentId = defaultFilters?.parentId || parentId;
		const finalUsername = defaultFilters?.username || username;
		const finalChannelSlug = defaultFilters?.channelSlug || channelSlug;

		if (finalParentId) filters.parentId = finalParentId;
		if (finalUsername) filters.username = finalUsername;
		if (finalChannelSlug) filters.channelSlug = finalChannelSlug;

		return Object.keys(filters).length > 0 ? filters : undefined;
	};

	return buildFilters();
};
