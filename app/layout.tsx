import "./globals.css";
import Command from "@/components/cmdk";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "David Chien | Software Engineer",
  description: "Software Engineer based in Taipei.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "light" }}
      className={cn(inter.className, "light")}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ModeToggle />
          <Command />
          <Analytics />
          <Script id="clarity" type="text/javascript">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");`}
          </Script>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
