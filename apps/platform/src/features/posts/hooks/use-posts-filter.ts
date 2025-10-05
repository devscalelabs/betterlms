import { useSearchParams } from "react-router";

interface PostsFilterOptions {
	parentId?: string;
	username?: string;
}

export const usePostsFilter = (defaultFilters?: PostsFilterOptions) => {
	const [searchParams] = useSearchParams();

	const buildFilters = (): PostsFilterOptions | undefined => {
		const filters: PostsFilterOptions = {};

		// Priority: defaultFilters > searchParams
		const parentId = defaultFilters?.parentId || searchParams.get("parentId");
		const username = defaultFilters?.username || searchParams.get("username");

		if (parentId) filters.parentId = parentId;
		if (username) filters.username = username;

		return Object.keys(filters).length > 0 ? filters : undefined;
	};

	return buildFilters();
};
