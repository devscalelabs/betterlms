import { Elysia, t } from "elysia";
import ogs from "open-graph-scraper";

export interface OpenGraphData {
	title: string;
	description: string;
	image: string;
	url: string;
}

async function fetchOpenGraphData(url: string): Promise<OpenGraphData | null> {
	try {
		const { result } = await ogs({ url });

		if (!result.success) {
			return null;
		}

		const ogTitle = result.ogTitle || result.twitterTitle || "";
		const ogDescription =
			result.ogDescription || result.twitterDescription || "";
		const ogImage =
			result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || "";
		const ogUrl = result.ogUrl || url;

		return {
			title: ogTitle,
			description: ogDescription,
			image: ogImage,
			url: ogUrl,
		};
	} catch (error) {
		console.error("Error fetching OG data:", error);
		return null;
	}
}

export const linkPreviewRouter = new Elysia({ prefix: "/link-preview" }).get(
	"/",
	async ({ query, status }) => {
		const { url } = query;

		if (!url) {
			return status(400, {
				error: "URL parameter is required",
			});
		}

		// Validate URL format
		try {
			new URL(url);
		} catch {
			return status(400, {
				error: "Invalid URL format",
			});
		}

		const ogData = await fetchOpenGraphData(url);

		if (!ogData) {
			return status(404, {
				error: "Failed to fetch preview data",
			});
		}

		return { preview: ogData };
	},
	{
		query: t.Object({
			url: t.String(),
		}),
	},
);
