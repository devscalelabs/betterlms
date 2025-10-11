import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/utils/api-client";
import type { CreateEventRequest, CreateEventResponse } from "../types";

type UseCreateEventOptions = {
	onSuccess?: () => void;
};

export const useCreateEvent = ({ onSuccess }: UseCreateEventOptions = {}) => {
	const [formData, setFormData] = useState<CreateEventRequest>({
		title: "",
		description: "",
		type: "ONLINE",
		date: "",
		url: "",
		city: "",
		address: "",
	});

	const queryClient = useQueryClient();

	const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
		mutationFn: async () => {
			const response = await api
				.post<CreateEventResponse>("api/v1/events/", {
					json: formData,
				})
				.json();
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			setFormData({
				title: "",
				description: "",
				type: "ONLINE",
				date: "",
				url: "",
				city: "",
				address: "",
			});
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to create event:", error);
		},
	});

	const handleTitleChange = (newTitle: string) => {
		setFormData({ ...formData, title: newTitle });
	};

	const handleDescriptionChange = (newDescription: string) => {
		setFormData({ ...formData, description: newDescription });
	};

	const handleTypeChange = (type: "ONLINE" | "OFFLINE") => {
		setFormData({ ...formData, type });
	};

	const handleDateChange = (date: string) => {
		setFormData({ ...formData, date });
	};

	const handleUrlChange = (url: string) => {
		setFormData({ ...formData, url });
	};

	const handleCityChange = (city: string) => {
		setFormData({ ...formData, city });
	};

	const handleAddressChange = (address: string) => {
		setFormData({ ...formData, address });
	};

	const isFormValid =
		formData.title.trim().length > 0 && formData.date.trim().length > 0;

	return {
		formData,
		handleTitleChange,
		handleDescriptionChange,
		handleTypeChange,
		handleDateChange,
		handleUrlChange,
		handleCityChange,
		handleAddressChange,
		createEvent,
		isCreatingEvent,
		isFormValid,
	};
};
