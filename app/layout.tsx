import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "David Chien - Software Engineer",
  description: "Portfolio of David Chien, a results-driven Software Engineer with expertise in frontend optimization, infrastructure modernization, and performance tuning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
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
      </body>
    </html>
  );
}
