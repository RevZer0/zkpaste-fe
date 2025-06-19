import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DeleteState, usePasteViewStore } from "@/stores/paste";
import { ProofOfKnowlege } from "@/app/service/paste";
import { deletePasteHandler } from "@/handlers/paste/delete";
import { ArmorValue } from "@/app/service/armor";

const DeleteModal = () => {
  const deleteState = usePasteViewStore((state) => state.deleteState);
  const encryptionKey = usePasteViewStore((state) => state.encryptionKey);
  const plainText = usePasteViewStore((state) => state.plainText);
  const password = usePasteViewStore((state) => state.password);
  const pasteData = usePasteViewStore((state) => state.pasteData);

  const toggleDelete = usePasteViewStore((state) => state.toggleDelete);
  const reset = usePasteViewStore((state) => state.reset);

  const deletePaste = async () => {
    if (!encryptionKey || !plainText || !pasteData) {
      return;
    }
    const signature = await ProofOfKnowlege(encryptionKey, plainText, password);
    try {
      await deletePasteHandler({
        paste_id: pasteData.pasteId,
        signature: ArmorValue(signature),
      });
      reset();
    } catch (e) {}
  };

  return (
    <Dialog open={deleteState == DeleteState.OPEN} onOpenChange={toggleDelete}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete paste</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this paste? You won't be able to
            restore it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={deletePaste}>
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteModal };
