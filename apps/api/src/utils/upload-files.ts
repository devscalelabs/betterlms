import { uploadObject } from "@betterlms/storages";

export async function uploadImageToS3(
  file: File,
  userId: string,
  folder: "posts" | "avatars" = "posts",
): Promise<string> {
  const timestamp = Date.now();
  const fileName = `${userId}/${timestamp}-${file.name}`;
  const key = `${folder}/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  await uploadObject({
    key,
    body: arrayBuffer,
    contentType: file.type,
  });

  // Use public endpoint if available, otherwise fall back to S3_ENDPOINT
  const publicEndpoint =
    process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT;
  const url = `${publicEndpoint}/${process.env.S3_BUCKET}/${key}`;
  return url;
}
