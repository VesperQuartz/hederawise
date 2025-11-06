import { env } from "env/env";
import { hc } from "hono/client";
import { routes } from "../../../../apps/backend/src";

export const client = hc<typeof routes>(env.EXPO_PUBLIC_BASE_URL);
