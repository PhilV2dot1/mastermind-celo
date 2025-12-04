/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/YOUR_UUID_HERE',
        permanent: false,
        statusCode: 307,
      },
    ];
  },
};

export default nextConfig;
