import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidyaloop | Emotional Balance Assessment",
  description: "Advanced AI-powered emotional intelligence platform for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <div className="fixed top-4 right-4 z-[100] text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 pointer-events-none">
          ( created by Aryan Singh )
        </div>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
