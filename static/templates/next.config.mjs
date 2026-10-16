const DOCS_URL = process.env.DOCS_URL;

/** @type {import("next").NextConfig} */
const nextConfig = {
	async rewrites() {
		// The docs are only served when DOCS_URL is set. It is never set in production.
		if (!DOCS_URL) {
			return [];
		}

		return [
			{ source: "/docs", destination: `${DOCS_URL}/docs/` },
			{
				source: "/docs/:path*",
				destination: `${DOCS_URL}/docs/:path*`,
			},
		];
	},
};

export default nextConfig;
