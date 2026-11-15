/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    agentUpgrade: "security",
    // Review forms can carry up to 3 photos of 5 MB each (default limit: 1 MB).
    serverActions: { bodySizeLimit: "16mb" },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mpnjvzyymmtvgsrfgjjc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "play.google.com",
        pathname: "/intl/en_us/badges/static/images/badges/**",
      },
      {
        protocol: "https",
        hostname: "developer.apple.com",
        pathname: "/app-store/marketing/guidelines/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
