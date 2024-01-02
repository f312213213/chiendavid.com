import "./globals.css";
import Command from "@/components/cmdk";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
