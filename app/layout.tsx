import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
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
        <Script id="woopra-analytics" strategy="afterInteractive">
          {`
            (function(){
              var t,o,c,e=window,n=document,r=arguments,a="script",i=["call","cancelAction","config","identify","push","track","trackClick","trackForm","update","visit"],s=function(){var t,o=this,c=function(t){o[t]=function(){return o._e.push([t].concat(Array.prototype.slice.call(arguments,0))),o}};for(o._e=[],t=0;t<i.length;t++)c(i[t])};for(e.__woo=e.__woo||{},t=0;t<r.length;t++)e.__woo[r[t]]=e[r[t]]=e[r[t]]||new s;(o=n.createElement(a)).async=1,o.src="https://static.woopra.com/js/w.js",(c=n.getElementsByTagName(a)[0]).parentNode.insertBefore(o,c)
            })("woopra");

            window.woopra = window.woopra || {};
            window.woopra.config && window.woopra.config({
              domain: "chiendavid.com",
              outgoing_tracking: true,
              download_tracking: true,
              click_tracking: true
            });
            window.woopra.track && window.woopra.track();
          `}
        </Script>
        
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
        <GoogleAnalytics gaId="G-TP0XQPDH1G" />
      </body>
    </html>
  );
}
