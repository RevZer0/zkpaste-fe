import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"


const DeleteModal = ({deleteHandler, ...props}) => {
  return (
      <Dialog {...props}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete paste</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this paste? You won't be able to restore it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" onClick={deleteHandler}>
                  Yes, Delete
                </Button>
            </DialogFooter>
          </DialogContent>
    </Dialog>
  )
}

export { DeleteModal } 
