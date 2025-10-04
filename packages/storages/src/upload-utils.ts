import type { S3StorageClient } from "./s3-client";
import type { UploadOptions, UploadResult } from "./types";

/**
 * Generate a unique file key with timestamp and random string
 */
export function generateFileKey(filename: string, prefix?: string): string {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	const extension = filename.split(".").pop() || "";
	const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
	const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "_");

	const key = `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
	return prefix ? `${prefix}/${key}` : key;
}

/**
 * Get content type from file extension
 */
export function getContentType(filename: string): string {
	const extension = filename.split(".").pop()?.toLowerCase();

	const mimeTypes: Record<string, string> = {
		// Images
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		webp: "image/webp",
		svg: "image/svg+xml",
		bmp: "image/bmp",
		ico: "image/x-icon",

		// Videos
		mp4: "video/mp4",
		webm: "video/webm",
		avi: "video/x-msvideo",
		mov: "video/quicktime",
		wmv: "video/x-ms-wmv",
		flv: "video/x-flv",

		// Audio
		mp3: "audio/mpeg",
		wav: "audio/wav",
		ogg: "audio/ogg",
		m4a: "audio/mp4",
		aac: "audio/aac",

		// Documents
		pdf: "application/pdf",
		doc: "application/msword",
		docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		xls: "application/vnd.ms-excel",
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		ppt: "application/vnd.ms-powerpoint",
		pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		txt: "text/plain",

		// Archives
		zip: "application/zip",
		rar: "application/x-rar-compressed",
		"7z": "application/x-7z-compressed",
		tar: "application/x-tar",
		gz: "application/gzip",
	};

	return mimeTypes[extension || ""] || "application/octet-stream";
}

/**
 * Validate file size
 */
export function validateFileSize(
	file: File | Buffer,
	maxSizeInMB: number,
): boolean {
	const sizeInBytes = file instanceof File ? file.size : file.length;
	const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
	return sizeInBytes <= maxSizeInBytes;
}

/**
 * Validate file type against allowed extensions
 */
export function validateFileType(
	filename: string,
	allowedExtensions: string[],
): boolean {
	const extension = filename.split(".").pop()?.toLowerCase();
	return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Upload file with automatic key generation and content type detection
 */
export async function uploadFileWithDefaults(
	client: S3StorageClient,
	file: File | Buffer,
	filename: string,
	options: Partial<UploadOptions> & { prefix?: string } = {},
): Promise<UploadResult> {
	const key = options.key || generateFileKey(filename, options.prefix);
	const contentType = options.contentType || getContentType(filename);

	const uploadOptions: UploadOptions = {
		key,
		contentType,
		metadata: {
			originalFilename: filename,
			uploadedAt: new Date().toISOString(),
			...options.metadata,
		},
		acl: options.acl || "private",
	};

	// Convert File to Buffer if needed
	const fileBuffer =
		file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

	return client.uploadFile(fileBuffer, uploadOptions);
}

/**
 * Common file type presets for validation
 */
export const FILE_TYPE_PRESETS = {
	IMAGES: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
	VIDEOS: ["mp4", "webm", "avi", "mov"],
	AUDIO: ["mp3", "wav", "ogg", "m4a", "aac"],
	DOCUMENTS: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
	ARCHIVES: ["zip", "rar", "7z", "tar", "gz"],
	ALL_MEDIA: [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"svg",
		"mp4",
		"webm",
		"avi",
		"mov",
		"mp3",
		"wav",
		"ogg",
		"m4a",
		"aac",
	],
} as const;
