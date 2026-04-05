/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  async redirects() {
    return [
      {
        source: "/login",
        has: [{ type: "query", key: "role", value: "admin" }],
        destination: "/?admin=1",
        permanent: false,
      },
      { source: "/login", destination: "/", permanent: false },
      { source: "/signup", destination: "/?mode=signup", permanent: false },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year — images are immutable (UUID-keyed)
    qualities: [60, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
};

export default nextConfig;
