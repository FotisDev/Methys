# Dockerizing Methys — from scratch

## 0. One prerequisite in your Next.js config

Add this to `next.config.js` (or `.mjs`/`.ts`) — required for the standalone
build the Dockerfile expects:

```js
module.exports = {
  output: 'standalone',
  // ...rest of your existing config
};
```

Without this, `.next/standalone` won't exist and the final image build will
fail at the `COPY --from=builder .../standalone` step.

## 1. Files to drop into your repo root

- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml` (optional, for local dev)

## 2. Build the image locally

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  -t methys:latest .
```

Or with compose (reads a `.env` file in the repo root):

```bash
docker compose up --build
```

Then visit http://localhost:3000.

## 3. Log in to Docker Hub

```bash
docker login
```

(enter your Docker Hub username + password or access token)

## 4. Tag the image for your Docker Hub repo

Replace `yourdockerhubusername` with your actual namespace:

```bash
docker tag methys:latest yourdockerhubusername/methys:latest
docker tag methys:latest yourdockerhubusername/methys:1.0.0
```

(the version tag is optional but good practice — bump it per release)

## 5. Push

```bash
docker push yourdockerhubusername/methys:latest
docker push yourdockerhubusername/methys:1.0.0
```

## 6. Pull and run anywhere

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  -e STRIPE_SECRET_KEY=your-stripe-key \
  --name methys \
  yourdockerhubusername/methys:latest
```

Add any other server-side env vars you use (PayPal, Klarna, etc.) with `-e`
flags or an `--env-file`.

## Notes specific to your setup

- **Supabase**: stays external — nothing to containerize there, just pass
  the URL/keys as env vars.
- **Vercel Blob (hero videos)**: also external; make sure the relevant
  Blob env var/token is passed in at runtime if your fetch code reads it
  server-side.
- **Secrets**: never bake `SUPABASE_SERVICE_ROLE_KEY` or Stripe secret keys
  into the image as build args (they'd be visible in image layer history) —
  pass those only at `docker run` / compose runtime via `-e` or `env_file`,
  not `--build-arg`.