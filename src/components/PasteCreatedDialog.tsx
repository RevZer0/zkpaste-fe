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
import { Dispatch, SetStateAction } from "react";

interface PasteCreateDialogProps {
  isOpen: boolean;
  pasteUrl: string;
  isOpenHandler: Dispatch<SetStateAction<boolean>>;
}

const PasteCreatedDialog = ({ ...props }: PasteCreateDialogProps) => {
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(props.pasteUrl);
  };
  return (
    <Dialog open={props.isOpen} onOpenChange={props.isOpenHandler}>
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
          <Input value={props.pasteUrl} readOnly />
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

export { PasteCreatedDialog };
