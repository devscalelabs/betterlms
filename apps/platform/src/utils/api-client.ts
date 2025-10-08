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
			(_, __, response) => {
				if (response.status === 401 || response.status === 403) {
					localStorage.removeItem("token");
					window.location.href = "/";
				}
			},
		],
	},
});
