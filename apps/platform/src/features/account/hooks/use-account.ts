import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api-client";
import type { AccountResponse } from "../types";

export const useAccount = () => {
	const { data: account, isLoading: isAccountLoading } = useQuery({
		enabled: !!localStorage.getItem("token"),
		queryKey: ["account"],
		queryFn: () => api.get<AccountResponse>("api/v1/account/").json(),
	});

	return { account, isAccountLoading };
};
