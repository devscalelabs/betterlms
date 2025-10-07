import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { api } from "@/utils/api-client";
import type { AccountResponse } from "../types";

export const useAccount = () => {
	const { data: account, isLoading: isAccountLoading } = useQuery({
		enabled: !!localStorage.getItem("token"),
		queryKey: ["account"],
		queryFn: async () => {
			try {
				const response = await api
					.get<AccountResponse>("api/v1/account/")
					.json();
				return response;
			} catch (error) {
				if (error instanceof HTTPError) {
					if (error.response.status === 404) {
						localStorage.removeItem("token");
					}
				}
				throw error;
			}
		},
	});

	return { account, isAccountLoading };
};
