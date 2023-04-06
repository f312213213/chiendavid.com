import './globals.css'
import type {ReactNode} from "react";
import type {Metadata} from "next";
import Sidebar from "@/components/Sidebar";


export const metadata: Metadata = {
  title: {
    default: 'David Chien',
    template: '%s | David Chien',
  },
  description: 'A student passionate about web development. Get in touch with me to know more.',
  openGraph: {
    title: 'David Chien',
    description: 'A student passionate about web development. Get in touch with me to know more.',
    url: 'https://chiendavid.com',
    siteName: 'David Chien',
    // images: [
    //   {
    //     url: 'https://leerob.io/og.jpg',
    //     width: 1920,
    //     height: 1080,
    //   },
    // ],
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'David Chien',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

const RootLayout = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <html lang="en" className="text-black bg-white dark:text-white dark:bg-[#111010] min-h-screen w-full overflow-x-hidden">
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  )
}

export default RootLayout