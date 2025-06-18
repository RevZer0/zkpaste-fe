"use client";

import { PasteCreatedDialog } from "@/components/PasteCreatedDialog";
import { PasteCreateForm } from "@/components/PasteCreateForm";

export default function Home() {
  return (
    <>
      <PasteCreatedDialog />
      <PasteCreateForm />
    </>
  );
}
