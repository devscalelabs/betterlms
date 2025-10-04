import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
	PresignedUrlOptions,
	PresignedUrlResult,
	S3Config,
	UploadOptions,
	UploadResult,
} from "./types";

export class S3StorageClient {
	private client: S3Client;
	private bucket: string;

	constructor(config: S3Config) {
		this.bucket = config.bucket;
		this.client = new S3Client({
			region: config.region,
			credentials: {
				accessKeyId: config.accessKeyId,
				secretAccessKey: config.secretAccessKey,
			},
		});
	}

	/**
	 * Upload a file to S3
	 */
	async uploadFile(
		file: Buffer | Uint8Array | string,
		options: UploadOptions,
	): Promise<UploadResult> {
		try {
			const command = new PutObjectCommand({
				Bucket: this.bucket,
				Key: options.key,
				Body: file,
				ContentType: options.contentType,
				Metadata: options.metadata,
				ACL: options.acl,
			});

			const result = await this.client.send(command);

			const url = `https://${this.bucket}.s3.amazonaws.com/${options.key}`;

			return {
				key: options.key,
				url,
				etag: result.ETag,
				size: file instanceof Buffer ? file.length : undefined,
			};
		} catch (error) {
			throw new Error(
				`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	/**
	 * Generate a presigned URL for direct client-side uploads
	 */
	async generatePresignedUploadUrl(
		options: PresignedUrlOptions,
	): Promise<PresignedUrlResult> {
		try {
			const command = new PutObjectCommand({
				Bucket: this.bucket,
				Key: options.key,
				ContentType: options.contentType,
				Metadata: options.metadata,
			});

			const url = await getSignedUrl(this.client, command, {
				expiresIn: options.expiresIn || 3600,
			});

			return {
				url,
				fields: {},
			};
		} catch (error) {
			throw new Error(
				`Failed to generate presigned URL: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	/**
	 * Generate a presigned URL for downloading/viewing files
	 */
	async generatePresignedDownloadUrl(
		key: string,
		expiresIn: number = 3600,
	): Promise<string> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: key,
			});

			return await getSignedUrl(this.client, command, { expiresIn });
		} catch (error) {
			throw new Error(
				`Failed to generate download URL: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	/**
	 * Get the public URL for a file (if bucket allows public access)
	 */
	getPublicUrl(key: string): string {
		return `https://${this.bucket}.s3.amazonaws.com/${key}`;
	}
}
