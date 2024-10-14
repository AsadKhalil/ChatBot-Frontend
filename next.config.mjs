/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        //301 redirect
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["ae-gpt-bucket-for-images.s3.amazonaws.com"],
  },
};

export default nextConfig;
