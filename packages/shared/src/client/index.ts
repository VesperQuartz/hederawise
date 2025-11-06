import { hc } from "hono/client";
import { routes } from "../../../../apps/backend/src";
import { env } from "../env";

export const client = hc<typeof routes>(env.EXPO_PUBLIC_BASE_URL);
