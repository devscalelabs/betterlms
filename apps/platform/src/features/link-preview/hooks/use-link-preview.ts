import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";
import type { LinkPreviewResponse } from "../types";

export const useLinkPreview = (url: string | null) => {
	const { data, isLoading } = useQuery({
		enabled: !!url,
		queryKey: ["link-preview", url],
		queryFn: () =>
			api
				.get("api/v1/link-preview/", {
					searchParams: { url: url || "" },
				})
				.json<LinkPreviewResponse>(),
		retry: false,
		staleTime: 1000 * 60 * 60, // 1 hour
	});

	return { preview: data?.preview, isLoading };
};
