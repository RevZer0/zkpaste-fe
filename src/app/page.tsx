"use client";

import { PasteCreatedDialog } from "@/components/create_form/PasteCreatedDialog";
import { PasteCreateForm } from "@/components/create_form/PasteCreateForm";

export default function Home() {
  return (
    <>
      <PasteCreatedDialog />
      <PasteCreateForm />
    </>
  );
}
