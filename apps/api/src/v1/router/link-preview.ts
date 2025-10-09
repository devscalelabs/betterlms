import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import ogs from "open-graph-scraper";
import { z } from "zod";

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

const linkPreviewRouter = new Hono();

linkPreviewRouter.get(
	"/link-preview/",
	zValidator(
		"query",
		z.object({
			url: z.string(),
		}),
	),
	async (c) => {
		const query = c.req.valid("query");
		const { url } = query;

		if (!url) {
			return c.json(
				{
					error: "URL parameter is required",
				},
				400,
			);
		}

		// Validate URL format
		try {
			new URL(url);
		} catch {
			return c.json(
				{
					error: "Invalid URL format",
				},
				400,
			);
		}

		const ogData = await fetchOpenGraphData(url);

		if (!ogData) {
			return c.json(
				{
					error: "Failed to fetch preview data",
				},
				404,
			);
		}

		return c.json({ preview: ogData });
	},
);

export { linkPreviewRouter };
