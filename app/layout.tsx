import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceToStructure",
  description: "Voice notes to structured content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-zinc-800 py-4 px-6">
          <h1 className="text-xl font-semibold tracking-tight">VoiceToStructure</h1>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
