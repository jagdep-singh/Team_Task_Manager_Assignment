import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const satoshi = Geist({
  variable: "--font-satoshi",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Submission by Jagdeep Singh for Ethara AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${jetbrains.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full flex flex-col">
        <header className="p-6 border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="font-mono text-lg font-bold">Ethara AI</span>
            <nav>
              <a href="/dashboard" className="text-sm font-medium hover:text-apple-blue">
                Dashboard
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl mx-auto">{children}</main>
        <footer className="p-6 border-t border-border text-center text-sm text-muted">
          © 2026 Ethara AI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}