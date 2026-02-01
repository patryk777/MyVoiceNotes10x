"use client";

import { Mic } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      {/* Top: Mic button */}
      <section className="flex-1 flex items-center justify-center">
        <button
          className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center animate-pulse transition-colors"
          aria-label="Record"
        >
          <Mic className="w-12 h-12 text-white" />
        </button>
      </section>

      {/* Bottom: Notes grid */}
      <section className="p-6">
        <h2 className="text-lg font-medium mb-4">Inteligentne Notatki</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Empty for now */}
        </div>
      </section>
    </div>
  );
}
