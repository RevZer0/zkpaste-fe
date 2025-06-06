"use client"


import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy, LockKeyhole, TriangleAlert} from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import {
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import axios from 'axios'
import { EncryptPayload } from "@/app/service/paste"
import { ArmorValue } from "@/app/service/armor"


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

import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert"


export default function Home() {
  const form = useForm({
    defaultValues: {
      paste: "",
      password: "",
      ttl: "",
      opens: "",
    }
  })
  const [successState, setSuccessState] = useState(false)
  const [pasteUrl, setPasteUrl] = useState(null)

  const genPasteUrl = (paste_id, key) => {
    return `${process.env.NEXT_PUBLIC_URL}/paste/${paste_id}#${ArmorValue(key)}`
  }

  const onSubmit = async (values) => {
    const {iv, ciphertext, signature, key} = await EncryptPayload(values.paste, values.password)
    const payload = {
      iv: ArmorValue(iv),
      ciphertext: ArmorValue(ciphertext),
      signature: ArmorValue(signature),
      metadata: {
        password_protected: values.password.length > 0,
        opens_count: parseInt(values.opens) || null,
        ttl: parseInt(values.ttl) || 86400
      }
    }
    const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/paste`, payload, {
      headers: {'Content-type': 'application/json'}
    });
    setSuccessState(true)
    setPasteUrl(genPasteUrl(data.paste_id, key))
  }

  return (<>
    {successState && 
      <Dialog open={true}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
              <div className="flex gap-2">
                <LockKeyhole size={16} color="#00ff00" />
                Paste Created Sucessfully
              </div>
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 mt-6">
              <Input value={pasteUrl} readOnly/>
              <Button type="button" onClick={ () => {navigator.clipboard.writeText(pasteUrl)}}><ClipboardCopy /></Button>
            </div>
            <Alert className="mb-6">
              <AlertTitle>
                <div className="flex gap-2">
                  <TriangleAlert size={16} />
                  Important Security Notice
                </div>
              </AlertTitle>
              <AlertDescription>
                This URL contains your encryption key. Anyone with this link can read your paste. Share it securely and never post it publicly.
              </AlertDescription>
            </Alert>
            <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button type="button">
                  Create Another Paste
                </Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    }
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 min-h-full grow max-w-6xl">
        <FormField
          control={form.control}
          name="paste"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea className="min-h-130 md:min-h-160" placeholder="Paste your content here" {... field}></Textarea>
              </FormControl>
              <FormDescription>
                This data will be encrypted locally before sending
              </FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiration period"/>
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
                <FormDescription>
                  Paste expires after this period
                </FormDescription>
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
                  <Input type="number" placeholder="Enter max opens count" {... field}></Input>
                </FormControl>
                <FormDescription>
                  Auto-delete after X views
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protect with password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {... field}></Input>
                </FormControl>
                <FormDescription>
                  Use strong password for better protection
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-start">
          <Button className="w-full md:w-40">Create Secure Paste</Button>
        </div>
      </form>
    </Form>
  </>);
}
