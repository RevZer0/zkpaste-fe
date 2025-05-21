import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZKPaste: Zero Knowlege Pastebin",
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
        <div className="flex flex-col min-h-screen w-full mx-auto">
          <header className="bg-gray-900">Header</header>
          <section className="flex-1 flex h-full justify-center bg-background">{children}</section>
          <footer className="bg-gray-900">Footer</footer>
        </div>
      </body>
    </html>
  );
}
