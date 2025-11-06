import { hc } from "hono/client";
import { env } from "@/env/env";
import { routes } from "../../backend/src/index";

export const client = hc<typeof routes>(env.EXPO_PUBLIC_BASE_URL);
