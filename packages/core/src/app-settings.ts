import { prisma } from "@betterlms/database";

export async function findAppSettings() {
	return await prisma.appSetting.findFirst();
}

export async function createAppSettings(data: {
	appName?: string;
	appLogoUrl?: string;
	appDescription?: string;
	appUrl?: string;
	enableRegistration?: boolean;
	enableComments?: boolean;
	enableLikes?: boolean;
	enableNotifications?: boolean;
	smtpHost?: string;
	smtpPort?: number;
	smtpUser?: string;
	smtpPassword?: string;
	githubUrl?: string;
	googleAnalyticsId?: string;
	mixpanelToken?: string;
	stripePublishableKey?: string;
	stripeSecretKey?: string;
	supportEmail?: string;
	contactEmail?: string;
	privacyPolicy?: string;
	termsOfService?: string;
	version?: string;
	updatedBy?: string;
}) {
	// Ensure only one app settings record exists
	const existingSettings = await prisma.appSetting.findFirst();
	if (existingSettings) {
		throw new Error("App settings already exist. Use update instead.");
	}

	return await prisma.appSetting.create({
		data,
	});
}

export async function updateAppSettings(data: {
	appName?: string;
	appLogoUrl?: string;
	appDescription?: string;
	appUrl?: string;
	enableRegistration?: boolean;
	enableComments?: boolean;
	enableLikes?: boolean;
	enableNotifications?: boolean;
	smtpHost?: string;
	smtpPort?: number;
	smtpUser?: string;
	smtpPassword?: string;
	githubUrl?: string;
	googleAnalyticsId?: string;
	mixpanelToken?: string;
	stripePublishableKey?: string;
	stripeSecretKey?: string;
	supportEmail?: string;
	contactEmail?: string;
	privacyPolicy?: string;
	termsOfService?: string;
	version?: string;
	updatedBy?: string;
}) {
	// Get the existing settings or create if doesn't exist
	let existingSettings = await prisma.appSetting.findFirst();

	if (!existingSettings) {
		// Create default settings if none exist
		existingSettings = await prisma.appSetting.create({
			data: {},
		});
	}

	return await prisma.appSetting.update({
		where: { id: existingSettings.id },
		data,
	});
}
