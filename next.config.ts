

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
    domains:['supabase'], //for local static images.
  },
};

module.exports = nextConfig;


