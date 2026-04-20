import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

import { ArmorValue } from "@/app/service/armor";
import { EncryptPayload } from "@/app/service/paste";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPasteHandler } from "@/handlers/paste/create";
import { usePasteStore } from "@/stores/paste";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const PasteCreateForm = () => {
  const onSuccessCallback = usePasteStore(
    (store) => store.pasteCreatedCallback,
  );
  const formSchema = z.object({
    paste: z
      .string()
      .min(1, {
        message: "I'm not against encrypting emptyness, but why?",
      })
      .max(128 * 1024, {
        message: "I think it is too much for the paste.",
      }),
    password: z.string(),
    ttl: z.string(),
    opens: z.string(),
    syntax: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paste: "",
      password: "",
      ttl: "86400",
      opens: "",
      syntax: "plaintext",
    },
  });
  const genPasteUrl = (paste_id: string, key: Uint8Array) => {
    return `${process.env.NEXT_PUBLIC_URL}/paste/${paste_id}#${ArmorValue(key)}`;
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { iv, ciphertext, signature, key } = await EncryptPayload(
      values.paste,
      values.password,
    );
    const payload = {
      iv: ArmorValue(iv),
      ciphertext: ArmorValue(ciphertext),
      signature: ArmorValue(signature),
      metadata: {
        password_protected: values.password.length > 0,
        opens_count: parseInt(values.opens) || null,
        ttl: parseInt(values.ttl) || 86400,
        syntax: values.syntax,
      },
    };
    try {
      const data = await createPasteHandler(payload);
      const url = genPasteUrl(data.paste_id, key);
      onSuccessCallback(url);
    } catch (e) {}
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 min-h-full grow max-w-6xl"
      >
        <FormField
          control={form.control}
          name="paste"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="min-h-130 md:min-h-160"
                  placeholder="Paste your text, code, notes here..."
                  {...field}
                ></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row md:justify-start gap-4">
          <FormField
            control={form.control}
            name="ttl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expires in</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiration period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="1800">30 minutes</SelectItem>
                    <SelectItem value="3600">1 hour</SelectItem>
                    <SelectItem value="86400">1 day</SelectItem>
                    <SelectItem value="432000">5 days</SelectItem>
                    <SelectItem value="604800">1 week</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="opens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>View limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter max opens count"
                    {...field}
                  ></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  ></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="syntax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Syntax</FormLabel>
                <FormControl>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="plaintext"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plaintext">PlainText</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-start">
          <Button className="w-full md:w-40">Create Paste</Button>
        </div>
      </form>
    </Form>
  );
};
