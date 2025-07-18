import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'via.placeholder.com', 
      'example.com', 
      'picsum.photos', 
      'placehold.co',
      'scontent.fsjc1-1.fna.fbcdn.net',
      'pbs.twimg.com',
      'images.unsplash.com',
      'static.nike.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
