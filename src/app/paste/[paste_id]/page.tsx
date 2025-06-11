"use client"

import { use, useState, useEffect } from 'react'

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { DecryptPaste, ProofOfKnowlege } from '@/app/service/paste'
import { DearmorValue, ArmorValue } from '@/app/service/armor'

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
import { DeleteModal } from '@/components/DeleteModal'
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert"

import Link from 'next/link'

const PasteView = ({params}) => {
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState(null)
  const [plainText, setPlainText] = useState(null)
  const [decryptFailed, setDecryptFailed] = useState(false)
  const [pasteData, setPasteData] = useState(null)
  const [password, setPassword] = useState(null)
  const [invalidPassword, setInvalidPassword] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [pasteNotFound, setPasteNotFound] = useState(false)
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
  const handleDelete = () => {
    if (!deleteModalOpen) {
      setDeleteModalOpen(true)
    }
  }

  const deletePaste = async () => {
    if (!plainText || !encryptionKey) {
      throw new Error("Trying to delete unencrypted paste somehow.")
    }
    const signature = await ProofOfKnowlege(encryptionKey, plainText, password)
    const payload = {
      signature: ArmorValue(signature)
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paste/${paste_id}/delete`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    
    setPlainText(null)
    setPasteData(null)
    setDeleteModalOpen(false)
  }
  
  const fetchPasteData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paste/${paste_id}`)
    if (response.status !== 200) {
      setPasteNotFound(true)
      return
    }
    const json = await response.json()
    setPasteData({
      iv: json.iv,
      paste: json.paste,
      passwordProtected: json.password_protected
    })
  }

  const updateViewCount = async() => {
    if (!plainText || !encryptionKey) {
      throw new Error("Trying to update view count of unencrypted paste somehow.")
    }
    const signature = await ProofOfKnowlege(encryptionKey, plainText, password)
    const payload = {
      signature: ArmorValue(signature)
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paste/${paste_id}/view`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  }

  const decodeCipher = async () => {
    const keyString = window.location.hash.substring(1)
    try {  
      const plainText = await DecryptPaste(
        DearmorValue(pasteData.paste), 
        DearmorValue(keyString),
        DearmorValue(pasteData.iv),
        password 
      )
      setPlainText(
        String.fromCharCode(...plainText)
      )
      setEncryptionKey(DearmorValue(keyString))
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
    if (!plainText && pasteData && (!pasteData.passwordProtected || password )) {
      decodeCipher()
    }
    if (plainText) {
      updateViewCount()
    }
    return () => {}
  }, [pasteData, password, plainText])
  
  if (decryptFailed) {
    return (<h1>Failed to decrypt the paste</h1>)
  }
  if (pasteNotFound) {
    return (
      <div className="space-y-4 p-4 min-h-full grow max-w-6xl">
        <h2 className="text-2xl text-sembold mb-12">Your paste is gone.</h2>
        <div>
          <h1>It may have:</h1>
          <ul className="list-disc [&>li]:mt-2 px-6">
            <li>Reached its expiration time</li>
            <li>Exceeded the view limit</li>
            <li>Been manually deleted</li>
            <li>Never existed at all</li>
          </ul>
          <Link href="/">
            <Button className="mt-12">Create Paste</Button>
          </Link>
        </div>
      </div>
    )
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
    <>
      <DeleteModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} deleteHandler={deletePaste}/>
      <div className="space-y-4 p-4 min-h-full grow max-w-6xl">
        <Card>
          <CardContent className="min-h-170 whitespace-pre-line">{plainText}</CardContent>
        </Card>
        <div className="flex justify-start">
          <Button className="w-full md:w-30" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </>
  )
}

export default PasteView
