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


const PasteView = ({params}) => {
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [plainText, setPlainText] = useState(null)
  const [decryptFailed, setDecryptFailed] = useState(false)
  const [pasteData, setPasteData] = useState(null)
  const { paste_id } = use(params)
  
  useEffect(() => {
    const fetchPasteData = async () => {
      const response = await fetch(`http://localhost:8000/paste/${paste_id}`)
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
          null 
        )
        setPlainText(
          String.fromCharCode(...plainText)
        )
      } catch (error) {
        setDecryptFailed(true) 
      }
    } 
    if (!pasteData) {
      fetchPasteData()
    }
    if (pasteData && !pasteData.passwordProtected) {
      decodeCipher()
    }
    return () => {}
  }, [pasteData])
  
  if (decryptFailed) {
    return (<h1>Failed to decrypt the paste</h1>)
  }
  if (!pasteData) {
    return (<h1>Loading...</h1>)
  }
  if (pasteData && pasteData.passwordProtected) {
    return (<h1>This paste is password protected</h1>)
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
