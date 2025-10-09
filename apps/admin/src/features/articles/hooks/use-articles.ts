import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api-client";
import type { Article } from "../types";

export type ArticlesResponse = {
  articles: Article[];
};

type UseArticlesOptions = {
  parentId?: string;
  username?: string;
  channelSlug?: string;
};

export const useArticles = (options: UseArticlesOptions = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (options.parentId) searchParams.append("parentId", options.parentId);
      if (options.username) searchParams.append("username", options.username);
      if (options.channelSlug)
        searchParams.append("channelSlug", options.channelSlug);

      const response = await api
        .get<ArticlesResponse>(`articles/?${searchParams.toString()}`)
        .json();
      return response.articles;
    },
  });

  const { mutate: deleteArticle, isPending: isDeletingArticle } = useMutation({
    mutationFn: async (articleId: string) => {
      const response = await api.delete(`articles/${articleId}/`).json();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      console.error("Failed to delete article:", error);
    },
  });

  return {
    articles: data || [],
    isLoading,
    error,
    deleteArticle,
    isDeletingArticle,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  };
};
