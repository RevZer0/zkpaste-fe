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
  const [plainText, setPlainText] = useState("Decoding...")
  const { paste_id } = use(params)
  
  useEffect(() => {
    const decodeCipher = async () => {
      const response = await fetch(`http://localhost:8000/paste/${paste_id}`)
      if (response.status !== 200) {
        throw new Error("Paste not found message should be implemented in the future")
      }
      const json = await response.json()
      
      setPasswordProtected(json.passwordProtected)
      
      const plainText = await DecryptPaste(
        DearmorValue(json.paste), 
        DearmorValue(window.location.hash.substring(1)),
        DearmorValue(json.iv),
        null
      )
      setPlainText(
        String.fromCharCode(...plainText)
      ) 
    }

    decodeCipher()
    return () => {}
  }, [paste_id])
  

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
