import type { Metadata } from "next";
import { Exo_2, Nabla } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/next";

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
        className={`${exo2.variable} ${nabla.variable} antialiased`}
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
<Analytics />
        <GoogleAnalytics gaId="G-TP0XQPDH1G" />
      </body>
    </html>
  );
}
