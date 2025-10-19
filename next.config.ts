/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mpnjvzyymmtvgsrfgjjc.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
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
    domains: [
      "mpnjvzyymmtvgsrfgjjc.supabase.co",
      "via.placeholder.com",
    ],
  },
};

module.exports = nextConfig;
