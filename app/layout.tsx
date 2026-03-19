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
  title: "David Chien - Travel Log",
  description: "Places I've been, things I've seen. A travel journal by David Chien.",
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
              var theme = localStorage.getItem('theme') || 'system';
              document.documentElement.classList.remove('light', 'dark');
              if (theme === 'light') {
                document.documentElement.classList.add('light');
              } else if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
              requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                  document.documentElement.classList.add('no-intro');
                }
              });
              console.log('%c\u2708\uFE0F Hey, curious one.', 'font-size:16px;font-weight:bold');
              console.log('%cBuilt by David Chien \u2014 chiendavid.com', 'color:#d95030');
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
