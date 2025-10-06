import { ThemeProvider } from "@betterlms/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter fullPageNavigationOnShallowFalseUpdates>
				<ThemeProvider>{children}</ThemeProvider>
			</NuqsAdapter>
		</QueryClientProvider>
	);
};
