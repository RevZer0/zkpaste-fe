import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function About() {
  return (
      <div className="space-y-4 p-4 min-h-full grow max-w-6xl">
        <h2 className="text-2xl text-semibold mb-12">How it works</h2>
            <p className="text-xl text-semibold">Client-side encryption</p>
            <p className="mt-2">Your text is encrypted in your browser using AES-GCM before being sent to our servers. We never see your original content - only the encrypted data.</p>

            <p className="text-xl text-semibold mt-4">Zero-knowledge architecture</p>
            <p className="mt-2">The encryption key is generated locally and stored in the URL fragment (the part after #). This key never leaves your device or reaches our servers, ensuring true zero-knowledge operation.</p>
            <p className="text-xl text-semibold mt-4">Password protection</p>
            <p className="mt-2">When you add a password, it's cryptographically combined with the base encryption key using HKDF key derivation. The password stays on your device only - we can't recover it even if we wanted to.</p>
            <p className="text-xl text-semibold mt-4">Secure deletion</p>
            <p className="mt-2">To delete a paste, you prove ownership by decrypting the content and providing an HMAC signature. No accounts, passwords, or server-side secrets required.</p>
            <p className="text-xl text-semibold mt-4">Automatic expiration</p>
            <p className="mt-2">Pastes automatically expire based on time limits or view counts you set. Once expired, they're permanently wiped from our servers with no recovery possible.</p>

            <Link href="/">
              <Button type="button" className="mt-12">Create Paste</Button>
            </Link>
      </div>
  )
}
