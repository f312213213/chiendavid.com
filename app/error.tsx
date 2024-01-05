"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
  return (
    <div className="w-full h-screen flex flex-col gap-2 items-start justify-center px-4 py-20 text-left max-w-xl mx-auto">
      <h2 className="text-2xl">Error</h2>
      <p>You just found some error one my site, sorry for that!</p>
      <Link href="/" className="w-full">
        <Button className="w-full">Back to home</Button>
      </Link>
    </div>
  );
}
