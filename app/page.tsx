import SiteContent from "@/components/SiteContent";
import StickyHeader from "@/components/StickyHeader";

export default function Home() {
  return (
    <main className="antialiased mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="lg:gap-4 grid lg:grid-cols-5">
        <StickyHeader />

        <SiteContent />
      </div>
    </main>
  );
}
