import {
	createAppSettings,
	findAppSettings,
	findUserById,
	updateAppSettings,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const appSettingsRouter = new Hono();

// Public endpoint to get app settings
appSettingsRouter.get("/app-settings/", async (c) => {
	let settings = await findAppSettings();

	// If no settings exist, create default settings
	if (!settings) {
		settings = await updateAppSettings({});
	}

	return c.json({ settings });
});

// Admin only endpoint to create app settings
appSettingsRouter.post(
	"/app-settings/",
	zValidator(
		"json",
		z.object({
			appName: z.string().optional(),
			appLogoUrl: z.string().optional(),
			appDescription: z.string().optional(),
			appUrl: z.string().optional(),
			enableRegistration: z.boolean().optional(),
			enableComments: z.boolean().optional(),
			enableLikes: z.boolean().optional(),
			enableNotifications: z.boolean().optional(),
			smtpHost: z.string().optional(),
			smtpPort: z.number().optional(),
			smtpUser: z.string().optional(),
			smtpPassword: z.string().optional(),
			githubUrl: z.string().optional(),
			googleAnalyticsId: z.string().optional(),
			mixpanelToken: z.string().optional(),
			stripePublishableKey: z.string().optional(),
			stripeSecretKey: z.string().optional(),
			supportEmail: z.string().optional(),
			contactEmail: z.string().optional(),
			privacyPolicy: z.string().optional(),
			termsOfService: z.string().optional(),
			version: z.string().optional(),
			updatedBy: z.string().optional(),
		}),
	),
	async (c) => {
		const token = c.req.header("authorization")?.split(" ")[1];

		if (!token) {
			return c.json(
				{
					error: "Unauthorized",
				},
				401,
			);
		}

		const userId = await verifyToken(token);
		const user = await findUserById(userId);

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				404,
			);
		}

		// Only admin users can create app settings
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can create app settings",
				},
				403,
			);
		}

		const body = c.req.valid("json");

		// Filter out undefined values to match core function expectations
		const filteredBody = Object.fromEntries(
			Object.entries(body).filter(([_, value]) => value !== undefined),
		);

		try {
			const settings = await createAppSettings(filteredBody);
			return c.json({ settings }, 201);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "App settings already exist. Use update instead."
			) {
				return c.json(
					{
						error: "App settings already exist. Use PUT to update instead.",
					},
					409,
				);
			}
			throw error;
		}
	},
);

// Admin only endpoint to update app settings
appSettingsRouter.put(
	"/app-settings/",
	zValidator(
		"json",
		z.object({
			appName: z.string().optional(),
			appLogoUrl: z.string().optional(),
			appDescription: z.string().optional(),
			appUrl: z.string().optional(),
			enableRegistration: z.boolean().optional(),
			enableComments: z.boolean().optional(),
			enableLikes: z.boolean().optional(),
			enableNotifications: z.boolean().optional(),
			smtpHost: z.string().optional(),
			smtpPort: z.number().optional(),
			smtpUser: z.string().optional(),
			smtpPassword: z.string().optional(),
			githubUrl: z.string().optional(),
			googleAnalyticsId: z.string().optional(),
			mixpanelToken: z.string().optional(),
			stripePublishableKey: z.string().optional(),
			stripeSecretKey: z.string().optional(),
			supportEmail: z.string().optional(),
			contactEmail: z.string().optional(),
			privacyPolicy: z.string().optional(),
			termsOfService: z.string().optional(),
			version: z.string().optional(),
			updatedBy: z.string().optional(),
		}),
	),
	async (c) => {
		const token = c.req.header("authorization")?.split(" ")[1];

		if (!token) {
			return c.json(
				{
					error: "Unauthorized",
				},
				401,
			);
		}

		const userId = await verifyToken(token);
		const user = await findUserById(userId);

		if (!user) {
			return c.json(
				{
					error: "User not found",
				},
				404,
			);
		}

		// Only admin users can update app settings
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can update app settings",
				},
				403,
			);
		}

		const body = c.req.valid("json");

		// Filter out undefined values to match core function expectations
		const filteredBody = Object.fromEntries(
			Object.entries(body).filter(([_, value]) => value !== undefined),
		);

		const settings = await updateAppSettings(filteredBody);

		return c.json({ settings });
	},
);

export { appSettingsRouter };
