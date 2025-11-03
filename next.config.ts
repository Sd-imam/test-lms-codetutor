import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true, 
  images: {
    remotePatterns: [
      // Cloudinary - for course thumbnails and avatars
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Allow localhost for development
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Removed 16 from imageSizes (Next.js 16 default, used by only 4.2% of projects)
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    // Updated to Next.js 16 default: 4 hours (14400s) instead of 60s
    minimumCacheTTL: 14400,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable image optimization
    unoptimized: false,
  },
};

export default nextConfig;
