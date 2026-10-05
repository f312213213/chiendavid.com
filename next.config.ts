/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "demodone.app",
      },
    ],
  },
  async redirects() {
    return [
      {                                                                                                  
             source: "/cv",                                                                            
            destination:                                                                              
           "https://docs.google.com/gview?url=https://raw.githubusercontent.com/f312213213/resume/refs/heads/master/david_chien_resume.pdf&embedded=false",   
             permanent: true,
        },
      {
        source: "/travel",
        destination: "/",
        permanent: true,
      },
      {
        source: "/linkedin",
        destination: "https://linkedin.com/in/davidchien886",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;