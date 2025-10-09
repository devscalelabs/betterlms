import { Button, Card, Input, Textarea } from "@betterlms/ui";
import { Save } from "lucide-react";
import React, { useId, useState } from "react";
import { useAppSettings } from "../hooks/use-app-settings";
import { useUpdateAppSettings } from "../hooks/use-update-app-settings";
import type { UpdateAppSettingsRequest } from "../types";

export const AppSettingsForm = () => {
	const { appSettings, isAppSettingsLoading } = useAppSettings();
	const { updateAppSettings, isUpdatingAppSettings, updateError } =
		useUpdateAppSettings();

	const [formData, setFormData] = useState<{
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
	}>({
		appName: "",
		appLogoUrl: "",
		appDescription: "",
		appUrl: "",
		enableRegistration: true,
		enableComments: true,
		enableLikes: true,
		enableNotifications: true,
		smtpHost: "",
		smtpUser: "",
		smtpPassword: "",
		githubUrl: "",
		googleAnalyticsId: "",
		mixpanelToken: "",
		stripePublishableKey: "",
		stripeSecretKey: "",
		supportEmail: "",
		contactEmail: "",
		privacyPolicy: "",
		termsOfService: "",
		version: "",
		updatedBy: "",
	});

	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Generate unique IDs for form elements
	const appNameId = useId();
	const appLogoUrlId = useId();
	const appDescriptionId = useId();
	const appUrlId = useId();
	const enableRegistrationId = useId();
	const enableCommentsId = useId();
	const enableLikesId = useId();
	const enableNotificationsId = useId();
	const smtpHostId = useId();
	const smtpPortId = useId();
	const smtpUserId = useId();
	const smtpPasswordId = useId();
	const githubUrlId = useId();
	const googleAnalyticsId = useId();
	const mixpanelTokenId = useId();
	const stripePublishableKeyId = useId();
	const stripeSecretKeyId = useId();
	const supportEmailId = useId();
	const contactEmailId = useId();
	const privacyPolicyId = useId();
	const termsOfServiceId = useId();
	const versionId = useId();

	// Initialize form data when app settings are loaded
	React.useEffect(() => {
		if (appSettings) {
			setFormData({
				appName: appSettings.appName || "",
				appLogoUrl: appSettings.appLogoUrl || "",
				appDescription: appSettings.appDescription || "",
				appUrl: appSettings.appUrl || "",
				enableRegistration: appSettings.enableRegistration,
				enableComments: appSettings.enableComments,
				enableLikes: appSettings.enableLikes,
				enableNotifications: appSettings.enableNotifications,
				smtpHost: appSettings.smtpHost || "",
				smtpUser: appSettings.smtpUser || "",
				smtpPassword: appSettings.smtpPassword || "",
				githubUrl: appSettings.githubUrl || "",
				googleAnalyticsId: appSettings.googleAnalyticsId || "",
				mixpanelToken: appSettings.mixpanelToken || "",
				stripePublishableKey: appSettings.stripePublishableKey || "",
				stripeSecretKey: appSettings.stripeSecretKey || "",
				supportEmail: appSettings.supportEmail || "",
				contactEmail: appSettings.contactEmail || "",
				privacyPolicy: appSettings.privacyPolicy || "",
				termsOfService: appSettings.termsOfService || "",
				version: appSettings.version || "",
				updatedBy: appSettings.updatedBy || "",
				...(appSettings.smtpPort && { smtpPort: appSettings.smtpPort }),
			});
			setHasUnsavedChanges(false);
		}
	}, [appSettings]);

	const handleInputChange = (
		field: keyof UpdateAppSettingsRequest,
		value: string | number | boolean | null,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setHasUnsavedChanges(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Filter out empty strings for optional fields
		const submitData: UpdateAppSettingsRequest = Object.fromEntries(
			Object.entries(formData).filter(
				([_, value]) => value !== "" && value !== undefined,
			),
		) as UpdateAppSettingsRequest;

		updateAppSettings(submitData, {
			onSuccess: () => {
				setHasUnsavedChanges(false);
			},
		});
	};

	if (isAppSettingsLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">Loading app settings...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">App Settings</h1>
					<p className="text-muted-foreground">
						Manage your application's global settings and configuration
					</p>
				</div>
				<div className="flex items-center gap-4">
					{hasUnsavedChanges && (
						<span className="text-sm text-amber-600">
							You have unsaved changes
						</span>
					)}
					<Button
						onClick={handleSubmit}
						disabled={isUpdatingAppSettings || !hasUnsavedChanges}
					>
						<Save className="mr-2 h-4 w-4" />
						{isUpdatingAppSettings ? "Saving..." : "Save Settings"}
					</Button>
				</div>
			</div>

			{/* Error display */}
			{updateError && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<div className="flex">
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">
								Failed to save settings
							</h3>
							<div className="mt-2 text-sm text-red-700">
								<p>
									An error occurred while saving your settings. Please try
									again.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Core App Settings */}
				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Core App Settings</h2>
						<p className="text-sm text-muted-foreground">
							Basic information about your application
						</p>
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor={appNameId} className="text-sm font-medium">
									App Name
								</label>
								<Input
									id={appNameId}
									value={formData.appName || ""}
									onChange={(e) => handleInputChange("appName", e.target.value)}
									placeholder="My App"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor={appUrlId} className="text-sm font-medium">
									App URL
								</label>
								<Input
									id={appUrlId}
									type="url"
									value={formData.appUrl || ""}
									onChange={(e) => handleInputChange("appUrl", e.target.value)}
									placeholder="https://myapp.com"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label htmlFor={appLogoUrlId} className="text-sm font-medium">
								Logo URL
							</label>
							<Input
								id={appLogoUrlId}
								type="url"
								value={formData.appLogoUrl || ""}
								onChange={(e) =>
									handleInputChange("appLogoUrl", e.target.value)
								}
								placeholder="https://myapp.com/logo.png"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor={appDescriptionId} className="text-sm font-medium">
								Description
							</label>
							<Textarea
								id={appDescriptionId}
								value={formData.appDescription || ""}
								onChange={(e) =>
									handleInputChange("appDescription", e.target.value)
								}
								placeholder="A brief description of your application"
								rows={3}
							/>
						</div>
					</div>
				</Card>

				{/* Feature Flags */}
				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Feature Flags</h2>
						<p className="text-sm text-muted-foreground">
							Enable or disable various application features
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<input
									type="checkbox"
									id={enableRegistrationId}
									checked={formData.enableRegistration || false}
									onChange={(e) =>
										handleInputChange("enableRegistration", e.target.checked)
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor={enableRegistrationId}
									className="text-sm font-medium"
								>
									Enable Registration
								</label>
							</div>
							<div className="flex items-center space-x-3">
								<input
									type="checkbox"
									id={enableCommentsId}
									checked={formData.enableComments || false}
									onChange={(e) =>
										handleInputChange("enableComments", e.target.checked)
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor={enableCommentsId}
									className="text-sm font-medium"
								>
									Enable Comments
								</label>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<input
									type="checkbox"
									id={enableLikesId}
									checked={formData.enableLikes || false}
									onChange={(e) =>
										handleInputChange("enableLikes", e.target.checked)
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label htmlFor={enableLikesId} className="text-sm font-medium">
									Enable Likes
								</label>
							</div>
							<div className="flex items-center space-x-3">
								<input
									type="checkbox"
									id={enableNotificationsId}
									checked={formData.enableNotifications || false}
									onChange={(e) =>
										handleInputChange("enableNotifications", e.target.checked)
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor={enableNotificationsId}
									className="text-sm font-medium"
								>
									Enable Notifications
								</label>
							</div>
						</div>
					</div>
				</Card>

				{/* Email Settings */}
				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Email Settings</h2>
						<p className="text-sm text-muted-foreground">
							SMTP configuration for sending emails
						</p>
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor={smtpHostId} className="text-sm font-medium">
									SMTP Host
								</label>
								<Input
									id={smtpHostId}
									value={formData.smtpHost || ""}
									onChange={(e) =>
										handleInputChange("smtpHost", e.target.value)
									}
									placeholder="smtp.gmail.com"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor={smtpPortId} className="text-sm font-medium">
									SMTP Port
								</label>
								<Input
									id={smtpPortId}
									type="number"
									value={formData.smtpPort || ""}
									onChange={(e) =>
										handleInputChange("smtpPort", Number(e.target.value))
									}
									placeholder="587"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor={smtpUserId} className="text-sm font-medium">
									SMTP Username
								</label>
								<Input
									id={smtpUserId}
									value={formData.smtpUser || ""}
									onChange={(e) =>
										handleInputChange("smtpUser", e.target.value)
									}
									placeholder="your-email@gmail.com"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor={smtpPasswordId} className="text-sm font-medium">
									SMTP Password
								</label>
								<Input
									id={smtpPasswordId}
									type="password"
									value={formData.smtpPassword || ""}
									onChange={(e) =>
										handleInputChange("smtpPassword", e.target.value)
									}
									placeholder="your-app-password"
								/>
							</div>
						</div>
					</div>
				</Card>

				{/* Analytics & Tracking */}
				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Analytics & Tracking</h2>
						<p className="text-sm text-muted-foreground">
							Configure analytics and tracking services
						</p>
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									htmlFor={googleAnalyticsId}
									className="text-sm font-medium"
								>
									Google Analytics ID
								</label>
								<Input
									id={googleAnalyticsId}
									value={formData.googleAnalyticsId || ""}
									onChange={(e) =>
										handleInputChange("googleAnalyticsId", e.target.value)
									}
									placeholder="GA-XXXXXXXXXX"
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor={mixpanelTokenId}
									className="text-sm font-medium"
								>
									Mixpanel Token
								</label>
								<Input
									id={mixpanelTokenId}
									value={formData.mixpanelToken || ""}
									onChange={(e) =>
										handleInputChange("mixpanelToken", e.target.value)
									}
									placeholder="your-mixpanel-token"
								/>
							</div>
						</div>
					</div>
				</Card>

				{/* Payment Settings */}
				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Payment Settings</h2>
						<p className="text-sm text-muted-foreground">
							Stripe configuration for payment processing
						</p>
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									htmlFor={stripePublishableKeyId}
									className="text-sm font-medium"
								>
									Stripe Publishable Key
								</label>
								<Input
									id={stripePublishableKeyId}
									value={formData.stripePublishableKey || ""}
									onChange={(e) =>
										handleInputChange("stripePublishableKey", e.target.value)
									}
									placeholder="pk_live_..."
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor={stripeSecretKeyId}
									className="text-sm font-medium"
								>
									Stripe Secret Key
								</label>
								<Input
									id={stripeSecretKeyId}
									type="password"
									value={formData.stripeSecretKey || ""}
									onChange={(e) =>
										handleInputChange("stripeSecretKey", e.target.value)
									}
									placeholder="sk_live_..."
								/>
							</div>
						</div>
					</div>
				</Card>

				{/* Contact Information */}
				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Contact Information</h2>
						<p className="text-sm text-muted-foreground">
							Support and contact details
						</p>
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor={supportEmailId} className="text-sm font-medium">
									Support Email
								</label>
								<Input
									id={supportEmailId}
									type="email"
									value={formData.supportEmail || ""}
									onChange={(e) =>
										handleInputChange("supportEmail", e.target.value)
									}
									placeholder="support@myapp.com"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor={contactEmailId} className="text-sm font-medium">
									Contact Email
								</label>
								<Input
									id={contactEmailId}
									type="email"
									value={formData.contactEmail || ""}
									onChange={(e) =>
										handleInputChange("contactEmail", e.target.value)
									}
									placeholder="contact@myapp.com"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label htmlFor={githubUrlId} className="text-sm font-medium">
								GitHub URL
							</label>
							<Input
								id={githubUrlId}
								type="url"
								value={formData.githubUrl || ""}
								onChange={(e) => handleInputChange("githubUrl", e.target.value)}
								placeholder="https://github.com/username/repo"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor={privacyPolicyId} className="text-sm font-medium">
								Privacy Policy URL
							</label>
							<Input
								id={privacyPolicyId}
								type="url"
								value={formData.privacyPolicy || ""}
								onChange={(e) =>
									handleInputChange("privacyPolicy", e.target.value)
								}
								placeholder="https://myapp.com/privacy"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor={termsOfServiceId} className="text-sm font-medium">
								Terms of Service URL
							</label>
							<Input
								id={termsOfServiceId}
								type="url"
								value={formData.termsOfService || ""}
								onChange={(e) =>
									handleInputChange("termsOfService", e.target.value)
								}
								placeholder="https://myapp.com/terms"
							/>
						</div>
					</div>
				</Card>

				{/* Metadata */}
				<Card className="p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold">Metadata</h2>
						<p className="text-sm text-muted-foreground">
							Version and update information
						</p>
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor={versionId} className="text-sm font-medium">
									Version
								</label>
								<Input
									id={versionId}
									value={formData.version || ""}
									onChange={(e) => handleInputChange("version", e.target.value)}
									placeholder="1.0.0"
								/>
							</div>
						</div>
					</div>
				</Card>
			</form>
		</div>
	);
};
