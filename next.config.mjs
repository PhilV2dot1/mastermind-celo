/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/019aebe0-0a84-bebb-914b-3cca14695652',
        permanent: false,
        statusCode: 307,
      },
    ];
  },
};

export default nextConfig;
