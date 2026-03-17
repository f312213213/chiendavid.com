import type { Metadata } from "next";
import { Inter, Space_Grotesk, Exo_2, Nabla } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  display: "swap",
});

const nabla = Nabla({
  variable: "--font-nabla",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "David Chien - Software Engineer",
  description: "David Chien — Software Engineer building web applications. Based in Prague, also available in Taiwan and the USA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${exo2.variable} ${nabla.variable} antialiased`}
      >
        
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'system';
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              document.documentElement.classList.remove('light', 'dark');
              
              if (theme === 'light') {
                document.documentElement.classList.add('light');
              } else if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            })();
          `
        }} />
        {children}

        {/* <Footer /> */}
        <Analytics />
        <GoogleAnalytics gaId="G-TP0XQPDH1G" />
      </body>
    </html>
  );
}
