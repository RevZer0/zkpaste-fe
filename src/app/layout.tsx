import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZK.paste: Zero Knowlege Pastebin",
  description: "Zero Knowlege Pastebin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full font-sans`}
      >
        <div className="flex flex-col min-h-screen w-full">
          <header className="flex justify-center p-2 bg-background">
            <div className="flex justify-between w-full max-w-6xl">
            <h2 className="text-2xl pl-4 text-semibold"><Link href="/">ZK.paste</Link></h2>
            <div className="flex justify-end">
              <Link href="/about">
                <Button variant="link">How it works</Button>
              </Link>
            </div>
            </div>
          </header>
          <section className="flex-1 flex h-full justify-center bg-background">{children}</section>
          <footer className="flex p-2 justify-center">&copy; 2025 ZK.paste. Because privacy matters.</footer>
        </div>
      </body>
    </html>
  );
}

