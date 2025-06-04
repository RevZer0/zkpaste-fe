"use client"


import { useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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


async function onSubmit(values) {
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
  const {data} = await axios.post('http://localhost:8000/paste', payload, {
    headers: {'Content-type': 'application/json'}
  });
  console.log("View paste URL: http://localhost:3000/paste/" + data.paste_id + "#" + ArmorValue(key))
}

export default function Home() {
  const form = useForm({
    defaultValues: {
      paste: "",
      password: "",
      ttl: "",
      opens: "",
    }
  })
  return (
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
          <Button className="w-full md:w-30">Paste!</Button>
        </div>
      </form>
    </Form>
  );
}
