import { uploadObject } from "@betterlms/storages";

export async function uploadImageToS3(
	file: File,
	userId: string,
): Promise<string> {
	const timestamp = Date.now();
	const fileName = `${userId}/${timestamp}-${file.name}`;
	const key = `posts/${fileName}`;

	const arrayBuffer = await file.arrayBuffer();
	await uploadObject({
		key,
		body: arrayBuffer,
		contentType: file.type,
	});

	const url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
	return url;
}
