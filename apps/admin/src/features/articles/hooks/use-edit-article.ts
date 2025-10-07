import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api-client";
import type { Article } from "../types";

export type EditArticleRequest = {
	title: string;
	content: string;
	channelId?: string;
	images?: File[];
};

export type ArticleResponse = {
	article: Article;
};

export type Channel = {
	id: string;
	name: string;
	isPrivate: boolean;
	createdAt: string;
	updatedAt: string;
};

type UseEditArticleOptions = {
	articleId: string;
	onSuccess?: () => void;
};

export const useEditArticle = ({
	articleId,
	onSuccess,
}: UseEditArticleOptions) => {
	const [formData, setFormData] = useState<EditArticleRequest>({
		title: "",
		content: "",
		channelId: "",
		images: [],
	});

	const queryClient = useQueryClient();

	// Fetch the article to edit
	const {
		data: article,
		isLoading: isLoadingArticle,
		error,
	} = useQuery({
		queryKey: ["article", articleId],
		queryFn: async () => {
			const response = await api
				.get<ArticleResponse>(`api/v1/articles/${articleId}`)
				.json();
			return response.article;
		},
		enabled: !!articleId,
	});

	// Fetch available channels
	const { data: channels, isLoading: isLoadingChannels } = useQuery({
		queryKey: ["channels"],
		queryFn: async () => {
			const response = await api
				.get<{ channels: Channel[] }>("api/v1/channels/")
				.json();
			return response.channels;
		},
	});

	// Initialize form data when article is loaded
	useEffect(() => {
		if (article) {
			setFormData({
				title: article.title || "",
				content: article.content,
				channelId: article.channelId || "",
				images: [],
			});
		}
	}, [article]);

	const { mutate: updateArticle, isPending: isUpdatingArticle } = useMutation({
		mutationFn: async () => {
			const updateData = {
				title: formData.title,
				content: formData.content,
				channelId: formData.channelId || undefined,
			};

			const response = await api
				.put<ArticleResponse>(`api/v1/articles/${articleId}`, {
					json: updateData,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles"] });
			queryClient.invalidateQueries({ queryKey: ["article", articleId] });
			onSuccess?.();
		},
		onError: (error) => {
			if (error instanceof HTTPError) {
				console.error("Failed to update article:", error);
			}
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);

		// Filter for PNG and JPEG only
		const validFiles = files.filter(
			(file) => file.type === "image/png" || file.type === "image/jpeg",
		);

		// Limit to maximum 10 images
		const newImages = [...(formData.images || []), ...validFiles].slice(0, 10);
		setFormData({ ...formData, images: newImages });
	};

	const removeImage = (index: number) => {
		setFormData({
			...formData,
			images: formData.images?.filter((_, i) => i !== index) || [],
		});
	};

	const handleTitleChange = (newTitle: string) => {
		setFormData({ ...formData, title: newTitle });
	};

	const handleContentChange = (newContent: string) => {
		setFormData({ ...formData, content: newContent });
	};

	const handleChannelChange = (channelId: string) => {
		setFormData({ ...formData, channelId });
	};

	const isFormValid =
		formData.title.trim().length > 0 && formData.content.trim().length > 0;

	return {
		article,
		isLoadingArticle,
		error,
		formData,
		channels: channels || [],
		isLoadingChannels,
		handleTitleChange,
		handleContentChange,
		handleChannelChange,
		handleFileChange,
		removeImage,
		updateArticle,
		isUpdatingArticle,
		isFormValid,
		selectedImages: formData.images || [],
	};
};
