"use client";

import { Search, Download, FileDown, Sparkles, Loader2, Undo2, Archive, Settings, HelpCircle } from "lucide-react";

interface ActionBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showArchive: boolean;
  onToggleArchive: () => void;
  canUndo: boolean;
  onUndo: () => void;
  onExportMarkdown: () => void;
  onExportPdf: () => void;
  onSummarize: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  isSummarizing: boolean;
  hasNotes: boolean;
  t: (key: string) => string;
}

export function ActionBar({
  searchQuery,
  onSearchChange,
  showArchive,
  onToggleArchive,
  canUndo,
  onUndo,
  onExportMarkdown,
  onExportPdf,
  onSummarize,
  onOpenSettings,
  onOpenHelp,
  isSummarizing,
  hasNotes,
  t,
}: ActionBarProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <button
        onClick={onOpenHelp}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 cursor-pointer"
        title="❓ Pomoc - skróty klawiszowe, instrukcja obsługi i FAQ"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      <button
        onClick={onOpenSettings}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 cursor-pointer"
        title={`⚙️ ${t("settings")} - język interfejsu, tłumaczenia, czas nagrywania`}
      >
        <Settings className="w-4 h-4" />
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
        title={`↩️ ${t("undo")} - cofnij ostatnią akcję (Ctrl+Z)`}
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleArchive}
        className={`p-2 border rounded-lg cursor-pointer ${
          showArchive
            ? "bg-yellow-600 border-yellow-500 text-white"
            : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
        }`}
        title={showArchive ? `📤 ${t("showActive")} - wróć do aktywnych notatek` : `📦 ${t("showArchive")} - pokaż ukryte notatki`}
      >
        <Archive className="w-4 h-4" />
      </button>
      <div className="relative flex-1 sm:flex-none">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 w-full sm:w-48 lg:w-64"
        />
      </div>
      <button
        onClick={onExportMarkdown}
        disabled={!hasNotes}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="📄 Export Markdown - pobierz notatki jako plik .md do edycji"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">.md</span>
      </button>
      <button
        onClick={onExportPdf}
        disabled={!hasNotes}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="📄 Export PDF - pobierz notatki jako plik PDF do druku"
      >
        <FileDown className="w-4 h-4" />
        <span className="hidden sm:inline">.pdf</span>
      </button>
      <button
        onClick={onSummarize}
        disabled={!hasNotes || isSummarizing}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="✨ Podsumuj AI - wygeneruj inteligentne podsumowanie wszystkich notatek"
      >
        {isSummarizing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">{t("summarize")}</span>
      </button>
    </div>
  );
}
