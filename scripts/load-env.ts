// Imported first so env files are loaded before src/env.ts validates them.
// Same precedence as Next.js: .env.local overrides .env.
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });
