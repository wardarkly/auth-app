import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";

export function AuditLogsPlugin(): BetterAuthPlugin {
	// Define events that should be logged AFTER they happen (when new session/user is created)
	const afterEvents = [
		"/sign-up/email",
		"/sign-in/email",
		"/sign-up/username",
		"/sign-in/username",
		"/verify-email",
		"/send-verification-email",
		"/forget-password",
		"/reset-password",
		"/change-password",
		"/change-email",
		"/update-user",
	];

	// Define events that should be logged BEFORE they happen (when session still exists)
	const beforeEvents = [
		"/sign-out",
		"/delete-user",
		"/revoke-session",
		"/revoke-sessions",
		"/revoke-other-sessions",
	];

	return {
		id: "audit-logs",
		hooks: {
			after: [{
				matcher: (context) => {
					return afterEvents.some((event) => context.path?.includes(event));
				},
				handler: createAuthMiddleware(async (ctx) => {
					try {
						// Get user from session (for existing session) or newSession (for new logins)
						const user =
							ctx.context.session?.user || ctx.context.newSession?.user;
						if (!user?.id) return;

						const userAgent =
							ctx.context.session?.session.userAgent ||
							ctx.context.newSession?.session.userAgent;
						const ipAddress =
							ctx.context.session?.session.ipAddress ||
							ctx.context.newSession?.session.ipAddress;

						// Get the endpoint path
						const event = ctx.path || "unknown";

						// Store audit log
						await ctx.context.adapter.create({
							model: "auditLogs",
							data: {
								userId: user.id,
								event,
								userAgent,
								ipAddress,
							},
						});
					} catch (error) {
						console.warn("[Audit] Failed to log event:", error);
						// Don't throw - audit logging failures shouldn't break auth flow
					}
				}),
			}, ],
			before: [{
				matcher: (context) => {
					return beforeEvents.some((event) => context.path?.includes(event));
				},
				handler: createAuthMiddleware(async (ctx) => {
					try {
						// Get user from existing session (before it gets destroyed)
						const user = ctx.context.session?.user;
						if (!user?.id) return;

						const userAgent = ctx.context.session?.session.userAgent;
						const ipAddress = ctx.context.session?.session.ipAddress;
						const event = ctx.path || "unknown";

						// Store audit log
						await ctx.context.adapter.create({
							model: "auditLogs",
							data: {
								userId: user.id,
								event,
								userAgent,
								ipAddress,
							},
						});
					} catch (error) {
						console.warn("[Audit] Failed to log before event:", error);
					}
				}),
			}, ],
		},
		schema: {
			auditLogs: {
				fields: {
					userId: {
						type: "string",
						required: true
					},
					event: {
						type: "string",
						required: true
					},
					userAgent: {
						type: "string",
						required: false
					},
					ipAddress: {
						type: "string",
						required: false
					},
					createdAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date()
					}
				},
				modelName: "auditLogs"
			}
		},
	} satisfies BetterAuthPlugin;
}