/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 1334353056,
    NEXT_PUBLIC_ZEGO_SERVER: "13ebde2b0ed03a341dc3a5ea4b508536",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
