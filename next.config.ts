import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  // webpack5: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  
  // --- UPDATE THIS 'images' CONFIGURATION ---
  images: {
    // remotePatterns is the recommended way for Next.js 13+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '', // Leave empty if no specific port
        pathname: '/**', // This allows all paths from placehold.co
      },
    ],
    // --- ADD these SVG-specific options ---
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline', // Ensure the browser renders it directly
    // Optional: Add a Content Security Policy for SVG images for extra security
    // This policy ensures no scripts can run within the SVGs
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", 
  },
  // --- END OF UPDATED 'images' CONFIGURATION ---
};

export default nextConfig;