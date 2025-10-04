import ky from "ky";

export const apiClient = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
});
