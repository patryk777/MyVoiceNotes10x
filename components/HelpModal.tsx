"use client";

import { X, Pencil, Archive, Trash2, Mic, FileText, FileDown, Settings, Undo2, Sparkles, Search, ArchiveRestore } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">📖 Dokumentacja</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-6">
          {/* Ikony na kartach */}
          <section>
            <h3 className="text-md font-semibold text-orange-400 mb-3">🎯 Ikony na kartach notatek</h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Pencil className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span><strong>Edytuj</strong> - otwiera tryb edycji notatki (tytuł, treść, kategoria, tagi, kolor)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Archive className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span><strong>Archiwizuj</strong> - przenosi notatkę do archiwum (nie usuwa!)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <ArchiveRestore className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span><strong>Przywróć</strong> - przywraca notatkę z archiwum</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Trash2 className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span><strong>Usuń</strong> - trwale usuwa notatkę (wymaga potwierdzenia)</span>
              </div>
            </div>
          </section>

          {/* Pasek akcji */}
          <section>
            <h3 className="text-md font-semibold text-orange-400 mb-3">🔧 Pasek akcji (górny)</h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span><strong>Szukaj</strong> - filtruje notatki po tytule i treści</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Undo2 className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span><strong>Cofnij</strong> - cofa ostatnią operację (Ctrl+Z)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span><strong>Eksport MD</strong> - pobiera notatki jako plik Markdown</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <FileDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span><strong>Eksport PDF</strong> - otwiera podgląd do druku/PDF</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span><strong>Podsumowanie AI</strong> - generuje podsumowanie wszystkich notatek</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Archive className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span><strong>Archiwum</strong> - przełącza widok między aktywnymi a zarchiwizowanymi</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Settings className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span><strong>Ustawienia</strong> - język interfejsu, limit nagrania</span>
              </div>
            </div>
          </section>

          {/* Nagrywanie */}
          <section>
            <h3 className="text-md font-semibold text-orange-400 mb-3">🎤 Nagrywanie głosu</h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded">
                <Mic className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span><strong>Mikrofon</strong> - kliknij aby nagrać, kliknij ponownie aby zatrzymać</span>
              </div>
              <p className="text-zinc-400 text-xs mt-2">
                Po nagraniu audio jest automatycznie transkrybowane (Whisper) i przetwarzane przez AI (GPT-4o) 
                na strukturyzowaną notatkę z kategorią.
              </p>
            </div>
          </section>

          {/* Skróty klawiszowe */}
          <section>
            <h3 className="text-md font-semibold text-orange-400 mb-3">⌨️ Skróty klawiszowe</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded">
                <kbd className="px-2 py-1 bg-zinc-700 rounded text-xs">Ctrl+Z</kbd>
                <span className="text-zinc-300">Cofnij</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded">
                <kbd className="px-2 py-1 bg-zinc-700 rounded text-xs">Ctrl+E</kbd>
                <span className="text-zinc-300">Eksport MD</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded">
                <kbd className="px-2 py-1 bg-zinc-700 rounded text-xs">Ctrl+Shift+S</kbd>
                <span className="text-zinc-300">Podsumowanie</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded">
                <kbd className="px-2 py-1 bg-zinc-700 rounded text-xs">Esc</kbd>
                <span className="text-zinc-300">Zamknij modal</span>
              </div>
            </div>
          </section>

          {/* Drag and drop */}
          <section>
            <h3 className="text-md font-semibold text-orange-400 mb-3">🖱️ Przeciąganie</h3>
            <p className="text-sm text-zinc-300">
              Możesz przeciągać karty notatek między kolumnami (kategoriami) aby zmienić ich kategorię.
            </p>
          </section>
        </div>

        <div className="p-4 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500">
            MyVoiceNotes10x • Projekt kursu 10xDevs 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
