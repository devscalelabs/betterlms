import ky from "ky";

export const api = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
	timeout: false,
	hooks: {
		beforeRequest: [
			(request) => {
				const token = localStorage.getItem("token");
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
		afterResponse: [
			(request, _options, response) => {
				// Only redirect to login for authentication-related endpoints
				// Don't redirect for article operations - let the component handle the error
				if (
					(response.status === 401 || response.status === 403) &&
					!request.url.includes("/articles/") &&
					!request.url.includes("/courses/")
				) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					window.location.href = "/";
				}
			},
		],
	},
});
