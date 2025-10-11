import { verifyToken } from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { uploadImageToS3 } from "../../utils/upload-files";

const mediaRouter = new Hono();

mediaRouter.post(
	"/media/",
	zValidator(
		"form",
		z.object({
			images: z.union([
				z.array(z.instanceof(File)),
				z.instanceof(File).transform((file) => [file]),
			]),
		}),
	),
	async (c) => {
		console.log("Media upload request received");
		console.log("Body keys:", Object.keys(c.req.valid("form") || {}));

		const token = c.req.header("authorization")?.split(" ")[1];

		if (!token) {
			return c.json(
				{
					error: "Unauthorized",
				},
				401,
			);
		}

		const userId = await verifyToken(token);
		const body = c.req.valid("form");
		const { images } = body;

		console.log(
			"Images received:",
			images
				? images.map((f: File) => ({
						name: f.name,
						type: f.type,
						size: f.size,
					}))
				: "No images",
		);

		if (!images || images.length === 0) {
			return c.json(
				{
					error: "No image provided",
				},
				400,
			);
		}

		// Take first image
		const firstImage = images[0];

		if (!firstImage) {
			return c.json(
				{
					error: "Invalid image provided",
				},
				400,
			);
		}

		try {
			console.log(`Uploading image: ${firstImage.name} for user: ${userId}`);

			// Upload to S3
			const url = await uploadImageToS3(firstImage, userId, "posts");
			console.log(`Uploaded: ${firstImage.name} -> ${url}`);

			return c.json(
				{
					url,
					filename: firstImage.name,
					size: firstImage.size,
					type: firstImage.type,
				},
				201,
			);
		} catch (error) {
			console.error("Failed to upload image:", error);
			return c.json(
				{
					error: "Failed to upload image",
				},
				500,
			);
		}
	},
);

export { mediaRouter };
