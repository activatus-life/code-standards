const DOCUMENTATION_URL = process.env.DOCUMENTATION_URL;

/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    // The docs are only served when DOCUMENTATION_URL is set. It is never set in production.
    if (!DOCUMENTATION_URL) {
      return [];
    }

    return [
      { source: "/documentation", destination: `${DOCUMENTATION_URL}/documentation/` },
      { source: "/documentation/:path*", destination: `${DOCUMENTATION_URL}/documentation/:path*` },
    ];
  },
};

export default nextConfig;
