import ky from "ky";

export const api = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
	hooks: {
		beforeRequest: [
			(request) => {
				request.headers.set(
					"Authorization",
					`Bearer ${localStorage.getItem("token")}`,
				);
			},
		],
	},
});
