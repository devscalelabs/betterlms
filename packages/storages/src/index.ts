// Main exports for the storages package
export { S3StorageClient } from "./s3-client";

// Types
export type {
	PresignedUrlOptions,
	PresignedUrlResult,
	S3Config,
	UploadOptions,
	UploadProgressCallback,
	UploadResult,
} from "./types";

// Utility functions
export {
	FILE_TYPE_PRESETS,
	generateFileKey,
	getContentType,
	uploadFileWithDefaults,
	validateFileSize,
	validateFileType,
} from "./upload-utils";
