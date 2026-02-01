import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyVoiceNotes",
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              MyVoiceNotes
            </h1>
            <span className="text-xs text-zinc-500 border border-zinc-700 rounded px-2 py-0.5">
              AI-Powered
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Zamień głos w uporządkowane notatki z automatyczną kategoryzacją
          </p>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
