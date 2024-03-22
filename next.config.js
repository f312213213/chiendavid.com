/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/cv",
        destination:
          "https://docs.google.com/document/d/1yA6CUtoBA6DaTF0Lrv6rzup-IDB5v1zZiwLXUwq4Hzg/edit?usp=sharing",
        permanent: true,
      },
      {
        source: "/ig",
        destination: "https://www.instagram.com/yeeggg_/",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/f312213213",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
