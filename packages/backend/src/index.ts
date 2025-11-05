import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { upgradeWebSocket, websocket } from "hono/bun";
import { hc } from "hono/client";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { openAPIRouteHandler, validator } from "hono-openapi";
import z from "zod";
import { type AuthEnv, auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "./routes/accounts";
import { lookups } from "./routes/lookups";
import { tokens } from "./routes/tokens";
import { wallet } from "./routes/wallet";

const app = new Hono<{
	Variables: AuthEnv;
}>().basePath("/api");

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

app.use(poweredBy());
app.use(logger());
app.use(secureHeaders());
app.use(requestId());
app.use(prettyJSON());
app.use(cors());

app.use("*", async (ctx, next) => {
	const session = await auth.api.getSession({ headers: ctx.req.raw.headers });

	if (!session) {
		ctx.set("user", null);
		ctx.set("session", null);
		return next();
	}

	ctx.set("user", session.user);
	ctx.set("session", session.session);
	return next();
});

app.use("*", async (c, next) => {
	const session = c.get("session");
	const allowedPath = [
		"/api/docs",
		"/api/openapi",
		"/api/healthcheck",
		"/api/hello",
	];
	if (!session) {
		const pathname = c.req.path;
		if (allowedPath.includes(pathname)) {
			return next();
		}
		return c.json({ message: "unauthorized" }, 401);
	}
	return next();
});

export const routes = app
	.route("/", accounts)
	.route("/", tokens)
	.route("/", wallet)
	.route("/", lookups)
	.get("/healthcheck", (c) => {
		return c.json({
			context: c.get("requestId"),
			message: "Works fine",
		});
	})
	.get("/hello", (c) => {
		return c.text("Hello Hono!!!");
	});

routes.get(
	"/openapi",
	openAPIRouteHandler(app, {
		documentation: {
			info: {
				title: "Hederawise",
				version: "1.0.0",
				description: "Hederawise API",
			},
			servers: [
				{
					url: "http://localhost:3000",
					description: "Server",
				},
				{
					url: "https://strong-carefully-fly.ngrok-free.app",
					description: "Server",
				},
			],
		},
	}),
);

routes.get(
	"/docs",
	Scalar({
		theme: "fastify",
		url: "/api/openapi",
	}),
);

app.get(
	"/ws",
	upgradeWebSocket(async (c) => {
		const user = c.get("user");
		const groupId = c.req.header("X-group-id");
		return {
			onOpen: (_evt, ws) => {
				ws.raw?.subscribe(groupId!);
				const msg = `user ${user.name} has entered group ${groupId}`;
				ws.raw?.publishText(groupId!, msg);
			},
			onMessage: async (evt, ws) => {
				ws.raw?.publishText(groupId!, evt.data.toString());
			},
			onClose: () => {
				console.log("connection closed");
			},
		};
	}),
);

export default {
	fetch: routes.fetch,
	websocket,
};
