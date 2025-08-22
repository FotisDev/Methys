

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mpnjvzyymmtvgsrfgjjc.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
     domains: [
    "mpnjvzyymmtvgsrfgjjc.supabase.co",
    "via.placeholder.com"
  ], 
  },
};

module.exports = nextConfig;


