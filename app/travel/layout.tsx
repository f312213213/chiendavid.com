import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Log - David Chien",
  description: "Photos and reflections from places I've been.",
};

export default function TravelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[100dvh] px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-background">
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
}
