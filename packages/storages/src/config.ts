import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";

export type S3Config = {
	region: string;
	bucket: string;
	endpoint?: string;
	forcePathStyle?: boolean;
};

const region = process.env.S3_REGION || "";
const bucket = process.env.S3_BUCKET || "";
const endpoint = process.env.S3_ENDPOINT || "";
const forcePathStyle =
	(process.env.S3_FORCE_PATH_STYLE || "").toLowerCase() === "true";

if (!region) {
	throw new Error("Missing S3_REGION environment variable");
}

if (!bucket) {
	throw new Error("Missing S3_BUCKET environment variable");
}

const clientConfig: S3ClientConfig = {
	region,
	forcePathStyle,
};
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
	clientConfig.credentials = {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	};
}
if (endpoint) {
	clientConfig.endpoint = endpoint;
}

export const s3 = new S3Client(clientConfig);

export const s3Config: S3Config = {
	region,
	bucket,
	forcePathStyle,
	...(endpoint ? { endpoint } : {}),
};

export const getBucketName = (): string => bucket;
