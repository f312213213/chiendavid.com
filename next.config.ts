/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/cv",
        destination:
          "https://raw.githubusercontent.com/f312213213/resume/refs/heads/master/david_chien_resume.pdf",
        permanent: true,
      },
      {
        source: "/linkedin",
        destination: "https://linkedin.com/in/davidchien419",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/f312213213",
        permanent: true,
      },
      {
        source: "/eth",
        destination: "https://app.ens.domains/davidchien.eth",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;