import { hc } from "hono/client";
import { routes } from "../../backend/src/index";
import { env } from "../env/env";

export const client = hc<typeof routes>(env.EXPO_PUBLIC_BASE_URL);
