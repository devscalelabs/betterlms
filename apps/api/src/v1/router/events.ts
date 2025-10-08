import {
	createEvent,
	deleteEvent,
	findEventById,
	findEvents,
	findUserById,
	updateEvent,
	verifyToken,
} from "@betterlms/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const eventsRouter = new Hono();

eventsRouter.get(
	"/events/",
	zValidator(
		"query",
		z.object({
			type: z.enum(["ONLINE", "OFFLINE"]).optional(),
		}),
	),
	async (c) => {
		const query = c.req.valid("query");
		const events = await findEvents({
			type: query.type,
		});

		return c.json({ events });
	},
);

eventsRouter.get("/events/:id", async (c) => {
	const event = await findEventById(c.req.param("id"));

	if (!event) {
		return c.json(
			{
				error: "Event not found",
			},
			404,
		);
	}

	return c.json({ event });
});

eventsRouter.post(
	"/events/",
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(200),
			description: z.string().max(2000).optional(),
			type: z.enum(["ONLINE", "OFFLINE"]).optional(),
			date: z.string().datetime(),
			url: z.string().url().optional(),
			city: z.string().max(100).optional(),
			address: z.string().max(500).optional(),
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

		// Only admin users can create events
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can create events",
				},
				403,
			);
		}

		const body = c.req.valid("json");
		const { title, description, type, date, url, city, address } = body;

		const event = await createEvent({
			title,
			description: description || null,
			type: type || "OFFLINE",
			date: new Date(date),
			url: url || null,
			city: city || null,
			address: address || null,
		});

		return c.json({ event }, 201);
	},
);

eventsRouter.put(
	"/events/:id",
	zValidator(
		"json",
		z.object({
			title: z.string().min(1).max(200).optional(),
			description: z.string().max(2000).nullable().optional(),
			type: z.enum(["ONLINE", "OFFLINE"]).optional(),
			date: z.string().datetime().optional(),
			url: z.string().url().nullable().optional(),
			city: z.string().max(100).nullable().optional(),
			address: z.string().max(500).nullable().optional(),
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

		// Only admin users can update events
		if (user.role !== "ADMIN") {
			return c.json(
				{
					error: "Forbidden - Only admin users can update events",
				},
				403,
			);
		}

		const event = await findEventById(c.req.param("id"));

		if (!event) {
			return c.json(
				{
					error: "Event not found",
				},
				404,
			);
		}

		const body = c.req.valid("json");
		const updateData: {
			title?: string;
			description?: string | null;
			type?: "ONLINE" | "OFFLINE";
			date?: Date;
			url?: string | null;
			city?: string | null;
			address?: string | null;
		} = {};

		if (body.title !== undefined) updateData.title = body.title;
		if (body.description !== undefined)
			updateData.description = body.description;
		if (body.type !== undefined) updateData.type = body.type;
		if (body.date !== undefined) updateData.date = new Date(body.date);
		if (body.url !== undefined) updateData.url = body.url;
		if (body.city !== undefined) updateData.city = body.city;
		if (body.address !== undefined) updateData.address = body.address;

		const updatedEvent = await updateEvent(c.req.param("id"), updateData);

		return c.json({ event: updatedEvent });
	},
);

eventsRouter.delete("/events/:id", async (c) => {
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

	// Only admin users can delete events
	if (user.role !== "ADMIN") {
		return c.json(
			{
				error: "Forbidden - Only admin users can delete events",
			},
			403,
		);
	}

	const event = await findEventById(c.req.param("id"));

	if (!event) {
		return c.json(
			{
				error: "Event not found",
			},
			404,
		);
	}

	await deleteEvent(c.req.param("id"));

	return c.json({ message: "Event deleted successfully" });
});

export { eventsRouter };
