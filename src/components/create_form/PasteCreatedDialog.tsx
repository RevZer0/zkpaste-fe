import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClipboardCopy, LockKeyhole, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePasteStore } from "@/stores/paste";

export const PasteCreatedDialog = () => {
  const isOpen = usePasteStore((state) => state.successDialogOpen);
  const isOpenHandler = usePasteStore((state) => state.successDialogToggle);
  const pasteUrl = usePasteStore((state) => state.pasteUrl);
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(pasteUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpenHandler}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2">
              <LockKeyhole size={16} color="#10b981" />
              Paste Created Sucessfully
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 mt-6">
          <Input value={pasteUrl} readOnly />
          <Button type="button" onClick={copyUrlToClipboard}>
            <ClipboardCopy />
          </Button>
        </div>
        <Alert className="mb-6">
          <AlertTitle>
            <div className="flex gap-2">
              <TriangleAlert size={16} />
              Important Security Notice
            </div>
          </AlertTitle>
          <AlertDescription>
            This URL contains your encryption key. Anyone with this link can
            read your paste. Share it securely and never post it publicly.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};
