"use client"

import { use, useState, useEffect } from 'react'

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { DecryptPaste } from '@/app/service/paste'
import { DearmorValue } from '@/app/service/armor'

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

import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form"

const PasteView = ({params}) => {
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [plainText, setPlainText] = useState(null)
  const [decryptFailed, setDecryptFailed] = useState(false)
  const [pasteData, setPasteData] = useState(null)
  const [password, setPassword] = useState(null)
  const [invalidPassword, setInvalidPassword] = useState(false)
  const { paste_id } = use(params)
  const form = useForm({
    defaultValues: {
      password: ""
    }
  })

  const unlockPaste = (values) => {
    if (values.password) {
      setPassword(values.password)
    }
  }
  
  const fetchPasteData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paste/${paste_id}`)
    if (response.status !== 200) {
      throw new Error("Paste not found message should be implemented in the future")
    }
    const json = await response.json()
    setPasteData({
      iv: json.iv,
      paste: json.paste,
      passwordProtected: json.password_protected
    })
  }

  const decodeCipher = async () => {
    try {  
      const plainText = await DecryptPaste(
        DearmorValue(pasteData.paste), 
        DearmorValue(window.location.hash.substring(1)),
        DearmorValue(pasteData.iv),
        password 
      )
      setPlainText(
        String.fromCharCode(...plainText)
      )
      setInvalidPassword(false)
    } catch (error) {
      if (password) {
        setInvalidPassword(true)
        setPassword(null)
      } else {
        setDecryptFailed(true) 
      }
    }
  } 

  useEffect(() => {
    if (!pasteData) {
      fetchPasteData()
    }
    if (pasteData && (!pasteData.passwordProtected || password )) {
      decodeCipher()
    }
    return () => {}
  }, [pasteData, password])
  
  if (decryptFailed) {
    return (<h1>Failed to decrypt the paste</h1>)
  }
  if (!pasteData) {
    return (<h1>Loading...</h1>)
  }
  if (pasteData && pasteData.passwordProtected && !password) {
    return (
      <Dialog open={true}>
      <Form {...form}>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <form className="space-y-4" onSubmit={form.handleSubmit(unlockPaste)}>
            <DialogHeader>
              <DialogTitle>Password Required</DialogTitle>
              <DialogDescription>
                This paste is protected with the password. Enter it to view the content.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="password"
              render={ ({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder=""/>
                  </FormControl>
                  {invalidPassword && <FormMessage>Invalid password. If you don't know the password you will not be able to decode paste content.</FormMessage>}

                </FormItem> 
              )}
            />
            <DialogFooter className="sm:justify-start">
                <Button type="submit">
                  Unlock Paste
                </Button>
            </DialogFooter>
        </form>
          </DialogContent>
      </Form>
    </Dialog>
    )
  }
  if (pasteData && !plainText) {
    return (<h1>Decoding...</h1>)
  }

  return (
    <div className="space-y-4 p-4 min-h-full grow max-w-6xl">
      <h2>Your paste</h2>
      <Card>
        <CardContent className="min-h-170 whitespace-pre-line">{plainText}</CardContent>
      </Card>
      <div className="flex justify-start">
        <Button className="w-full md:w-30">Delete</Button>
      </div>
    </div>
  )
}

export default PasteView
