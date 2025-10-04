export interface S3Config {
	region: string;
	bucket: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export interface UploadOptions {
	key: string;
	contentType?: string;
	metadata?: Record<string, string>;
	acl?: "private" | "public-read" | "public-read-write" | "authenticated-read";
}

export interface UploadResult {
	key: string;
	url: string;
	etag?: string | undefined;
	size?: number | undefined;
}

export interface PresignedUrlOptions {
	key: string;
	contentType?: string;
	expiresIn?: number; // seconds, default 3600 (1 hour)
	metadata?: Record<string, string>;
}

export interface PresignedUrlResult {
	url: string;
	fields: Record<string, string>;
}

export type UploadProgressCallback = (progress: {
	loaded: number;
	total: number;
	percentage: number;
}) => void;
