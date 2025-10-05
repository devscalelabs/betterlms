import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../../utils/api-client";

export type CreateArticleRequest = {
	title: string;
	content: string;
	channelId?: string;
	images?: File[];
};

export type CreateArticleResponse = {
	post: {
		id: string;
		title: string | null;
		content: string;
		likeCount: number;
		replyCount: number;
		channelId: string | null;
		userId: string | null;
		parentId: string | null;
		isDeleted: boolean;
		createdAt: string;
		updatedAt: string;
		user: {
			id: string;
			name: string;
			username: string;
			imageUrl: string | null;
		} | null;
		channel: {
			id: string;
			name: string;
		} | null;
		Media?: {
			id: string;
			url: string;
			type: "IMAGE" | "VIDEO" | "DOCUMENT";
		}[];
	};
};

export type Channel = {
	id: string;
	name: string;
	isPrivate: boolean;
	createdAt: string;
	updatedAt: string;
};

type UseCreateArticleOptions = {
	onSuccess?: () => void;
};

export const useCreateArticle = ({
	onSuccess,
}: UseCreateArticleOptions = {}) => {
	const [formData, setFormData] = useState<CreateArticleRequest>({
		title: "",
		content: "",
		channelId: "",
		images: [],
	});

	const queryClient = useQueryClient();

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

	const { mutate: createArticle, isPending: isCreatingArticle } = useMutation({
		mutationFn: async () => {
			const formDataToSend = new FormData();

			// Add required fields
			formDataToSend.append("title", formData.title);
			formDataToSend.append("content", formData.content);

			// Add optional channel
			if (formData.channelId) {
				formDataToSend.append("channelId", formData.channelId);
			}

			// Add images
			if (formData.images && formData.images.length > 0) {
				formData.images.forEach((image) => {
					formDataToSend.append("images", image);
				});
			}

			const response = await api
				.post<CreateArticleResponse>("api/v1/articles/", {
					body: formDataToSend,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["articles"] });
			setFormData({ title: "", content: "", channelId: "", images: [] });
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to create article:", error);
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

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
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

	const handleImageUpload = async (file: File): Promise<string> => {
		const formDataToSend = new FormData();
		formDataToSend.append("images", file);

		try {
			const response = await api
				.post<{ url: string; filename: string; size: number; type: string }>(
					"api/v1/media/",
					{
						body: formDataToSend,
					},
				)
				.json();

			return response.url;
		} catch (error) {
			console.error("Failed to upload image:", error);
			throw error;
		}
	};

	return {
		formData,
		channels: channels || [],
		isLoadingChannels,
		handleTitleChange,
		handleContentChange,
		handleChannelChange,
		handleFileChange,
		removeImage,
		createArticle,
		isCreatingArticle,
		isFormValid,
		generateSlug,
		selectedImages: formData.images || [],
		handleImageUpload,
	};
};
