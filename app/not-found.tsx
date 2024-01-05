import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col gap-2 items-start justify-center px-4 py-20 text-left max-w-xl mx-auto">
      <h2 className="text-2xl">Not Found</h2>
      <p>This page has been deleted, or moved. I don&apos;t actually know.</p>
      <Link href="/" className="w-full">
        <Button className="w-full">Back to home</Button>
      </Link>
    </div>
  );
}
