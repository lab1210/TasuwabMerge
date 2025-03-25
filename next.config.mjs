/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://localhost:54092/:path*", // Replace 5000 with your backend port
      },
    ];
  },
};

export default nextConfig;
