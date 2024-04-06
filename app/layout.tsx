import "./globals.css";
import Analytic from "@/components/Analytic";
import TailwindIndicator from "@/components/TailwindIndicator";
import Command from "@/components/cmdk";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
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
      style={{ colorScheme: "dark" }}
      className={cn(inter.className, "dark")}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ModeToggle />
          <Command />
          <Analytic />
          <TailwindIndicator />
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
