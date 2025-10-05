import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getBucketName, s3 } from "./config";

export type UploadParams = {
	key: string;
	body: Blob | Uint8Array | string | ReadableStream<Uint8Array> | ArrayBuffer;
	contentType?: string;
};

function normalizeBody(
	body: UploadParams["body"],
): Blob | Uint8Array | string | ReadableStream<Uint8Array> {
	if (body instanceof ArrayBuffer) {
		return new Uint8Array(body);
	}
	return body as Blob | Uint8Array | string | ReadableStream<Uint8Array>;
}

export async function uploadObject({ key, body, contentType }: UploadParams) {
	const command = new PutObjectCommand({
		Bucket: getBucketName(),
		Key: key,
		Body: normalizeBody(body),
		ContentType: contentType,
	});
	await s3.send(command);
	return { key };
}

export async function deleteObject(key: string) {
	const command = new DeleteObjectCommand({
		Bucket: getBucketName(),
		Key: key,
	});
	await s3.send(command);
}
