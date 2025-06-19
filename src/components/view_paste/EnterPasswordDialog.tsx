import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  PasswordState,
  PasteDecryptionState,
  usePasteViewStore,
} from "@/stores/paste";

interface PasswordFormInput {
  password: string;
}

export const EnterPasswordDialog = () => {
  const decryptState = usePasteViewStore((state) => state.decryptState);
  const passwordState = usePasteViewStore((state) => state.passwordState);

  const passwordSet = usePasteViewStore((state) => state.passwordSet);

  const form = useForm<PasswordFormInput>({
    defaultValues: {
      password: "",
    },
  });
  const unlockPaste = (values: PasswordFormInput) => {
    if (values.password) {
      passwordSet(values.password);
    }
  };
  return (
    <Dialog open={decryptState == PasteDecryptionState.PASSWORD_REQUIRED}>
      <Form {...form}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <form className="space-y-4" onSubmit={form.handleSubmit(unlockPaste)}>
            <DialogHeader>
              <DialogTitle>Password Required</DialogTitle>
              <DialogDescription>
                This paste is protected with the password. Enter it to view the
                content.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="" />
                  </FormControl>
                  {passwordState == PasswordState.INVALID && (
                    <FormMessage>
                      Invalid password. If you don't know the password you will
                      not be able to decode paste content.
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-start">
              <Button type="submit">Unlock Paste</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};
