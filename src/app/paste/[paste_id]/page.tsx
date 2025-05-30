"use client"

import { use, useState, useEffect } from 'react'

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'


const PasteView = ({params}) => {
  const decodeCipher = async () => {
    fetch(`http://localhost:8000/paste/${paste_id}`).then((data) => {
      data.json().then((json) => {
        setPasswordProtected(json.passwordProtected)
        
        const ciphertext = Uint8Array.from(
          atob(json.paste),
          c => c.charCodeAt(0)
        )
        const rawKey = Uint8Array.from(
          atob(window.location.hash.substring(1)),
          c => c.charCodeAt(0)
        )
        const encryptionKey = await window.crypto.subtle.importKey(
          "raw", rawKey,  {name: "AES-GCM"}, false, ["decrypt"]
        )
        console.log(encryptionKey)
        setPlainText(
          await window.crypto.subtle.decrypt(
            {name: "AES-GCM"}, encryptionKey, ciphertext
          )
        ) 

        console.log(encryptionKey)
      })
    })
  } 
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [plainText, setPlainText] = useState("Decoding...")
  const { paste_id } = use(params)
  
  useEffect(() => {
    decodeCipher()
    return () => {}
  }, [paste_id])
  

  return (
    <div className="space-y-4 p-4 min-h-full grow max-w-6xl">
      <h2>Your paste</h2>
      <Card>
        <CardContent className="min-h-170">{plainText}</CardContent>
      </Card>
      <div className="flex justify-start">
        <Button className="w-full md:w-30">Delete</Button>
      </div>
    </div>
  )
}

export default PasteView
