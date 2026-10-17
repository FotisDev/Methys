import { z } from "zod";

// Available everywhere. NEXT_PUBLIC_* values are inlined into the browser
// bundle at build time, so they must be listed in `clientRuntimeEnv` below
// with literal `process.env.X` access or Next.js won't inline them.
const clientSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().trim().url().optional(),
  NEXT_PUBLIC_IS_LIVE_SITE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

// Server only. Validated lazily on first access, so `next build` (e.g. the
// Docker builder stage, which only gets NEXT_PUBLIC_* args) doesn't need them.
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  REVALIDATE_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  // Resend's test sender only delivers to the account owner. Set this to an
  // address on a verified domain to send to real customers.
  RESEND_FROM_EMAIL: z
    .string()
    .min(1)
    .default("Methys <onboarding@resend.dev>"),
  RESEND_WEBHOOK_SECRET: z.string().min(1).optional(),
  // Where new support-ticket notifications go.
  SUPPORT_INBOX_EMAIL: z.string().email().default("fotislir@outlook.com"),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

// Treat `KEY=` in an env file as unset rather than as an empty string.
function emptyAsUndefined<T extends Record<string, string | undefined>>(
  values: T,
): T {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ]),
  ) as T;
}

function parse<T extends z.ZodTypeAny>(
  schema: T,
  values: Record<string, string | undefined>,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(emptyAsUndefined(values));
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`❌ Invalid ${label} environment variables:\n${issues}`);
  }
  return result.data;
}

const clientRuntimeEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_IS_LIVE_SITE: process.env.NEXT_PUBLIC_IS_LIVE_SITE,
};

const clientEnv = parse(clientSchema, clientRuntimeEnv, "client");

let serverEnv: ServerEnv | undefined;
function getServerEnv(): ServerEnv {
  serverEnv ??= parse(serverSchema, process.env, "server");
  return serverEnv;
}

const isServer = typeof window === "undefined";

export const env = new Proxy({} as ClientEnv & ServerEnv, {
  get(_target, key) {
    if (typeof key !== "string") return undefined;
    if (key in clientSchema.shape) return clientEnv[key as keyof ClientEnv];
    if (!(key in serverSchema.shape)) return undefined;
    if (!isServer) {
      throw new Error(
        `❌ Attempted to access server-side environment variable "${key}" on the client`,
      );
    }
    return getServerEnv()[key as keyof ServerEnv];
  },
});
