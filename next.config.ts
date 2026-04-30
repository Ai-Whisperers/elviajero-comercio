import type { NextConfig } from "next"
const config: NextConfig = {
  images: { unoptimized: true },
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/s/:path*",
        destination: "/",
        permanent: true,
      },
    ]
  },
}
export default config
