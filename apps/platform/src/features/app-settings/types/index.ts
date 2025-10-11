export interface AppSettings {
	id: string;
	appName: string | null;
	appLogoUrl: string | null;
	appDescription: string | null;
	appUrl: string | null;
	enableRegistration: boolean;
	enableComments: boolean;
	enableLikes: boolean;
	enableNotifications: boolean;
	smtpHost: string | null;
	smtpPort: number | null;
	smtpUser: string | null;
	smtpPassword: string | null;
	githubUrl: string | null;
	googleAnalyticsId: string | null;
	mixpanelToken: string | null;
	stripePublishableKey: string | null;
	stripeSecretKey: string | null;
	supportEmail: string | null;
	contactEmail: string | null;
	privacyPolicy: string | null;
	termsOfService: string | null;
	version: string | null;
	updatedBy: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AppSettingsResponse {
	settings: AppSettings;
}
