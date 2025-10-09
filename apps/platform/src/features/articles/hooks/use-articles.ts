import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { ArticlesResponse } from "../types";

type UseArticlesOptions = {
  username?: string;
  channelSlug?: string;
};

export const useArticles = (options: UseArticlesOptions = {}) => {
  return useQuery({
    queryKey: ["articles", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options.username) {
        params.append("username", options.username);
      }
      if (options.channelSlug) {
        params.append("channelSlug", options.channelSlug);
      }

      const response = await api
        .get<ArticlesResponse>(`articles/?${params.toString()}`)
        .json();
      return response.articles;
    },
  });
};
