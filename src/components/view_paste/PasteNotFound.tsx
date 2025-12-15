import Link from "next/link";
import { Button } from "@/components/ui/button";

export const PasteNotFound = () => {
  return (
    <div className="space-y-4 p-4 min-h-full grow max-w-6xl">
      <h2 className="text-2xl text-sembold mb-12">Your paste is gone.</h2>
      <div>
        <h1>It may have:</h1>
        <ul className="list-disc [&>li]:mt-2 px-6">
          <li>Reached its expiration time</li>
          <li>Exceeded the view limit</li>
          <li>Been manually deleted</li>
          <li>Never existed at all</li>
        </ul>
        <Link href="/">
          <Button className="mt-12">Create Paste</Button>
        </Link>
      </div>
    </div>
  );
};
