import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { ArticleResponse } from "../types";

export const useArticle = (id: string) => {
	return useQuery({
		queryKey: ["article", id],
		queryFn: async () => {
			const response = await api
				.get<ArticleResponse>(`api/v1/articles/${id}/`)
				.json();
			return response.article;
		},
		enabled: !!id,
	});
};
