import { Elysia, t } from "elysia";
import { uploadImageToS3 } from "../../utils/upload-files";
import { verifyToken } from "../services/jwt";

export const mediaRouter = new Elysia({ prefix: "/media" }).post(
	"/",
	async ({ body, headers, status }) => {
		console.log("Media upload request received");
		console.log("Headers:", headers);
		console.log("Body keys:", Object.keys(body || {}));

		const token = headers.authorization?.split(" ")[1];

		if (!token) {
			return status(401, {
				error: "Unauthorized",
			});
		}

		const userId = await verifyToken(token);
		const { images } = body;

		console.log(
			"Images received:",
			images
				? images.map((f) => ({ name: f.name, type: f.type, size: f.size }))
				: "No images",
		);

		if (!images || images.length === 0) {
			return status(400, {
				error: "No image provided",
			});
		}

		// Take the first image
		const firstImage = images[0];

		if (!firstImage) {
			return status(400, {
				error: "Invalid image provided",
			});
		}

		try {
			console.log(`Uploading image: ${firstImage.name} for user: ${userId}`);

			// Upload to S3
			const url = await uploadImageToS3(firstImage, userId, "posts");
			console.log(`Uploaded: ${firstImage.name} -> ${url}`);

			return status(201, {
				url,
				filename: firstImage.name,
				size: firstImage.size,
				type: firstImage.type,
			});
		} catch (error) {
			console.error("Failed to upload image:", error);
			return status(500, {
				error: "Failed to upload image",
			});
		}
	},
	{
		body: t.Object({
			images: t.Files(),
		}),
	},
);
