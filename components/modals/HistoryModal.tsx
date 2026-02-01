"use client";

import { History, X } from "lucide-react";
import { NoteVersion } from "@/hooks/useNotes";

interface HistoryModalProps {
  versions: NoteVersion[];
  onRestore: (version: NoteVersion) => void;
  onClose: () => void;
  t: (key: string) => string;
}

export function HistoryModal({ versions, onRestore, onClose, t }: HistoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">{t("history")}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {versions.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-4">{t("noHistory")}</p>
          ) : (
            [...versions].reverse().map((version, idx) => (
              <div key={idx} className="bg-zinc-800 rounded p-3 border border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{version.title}</span>
                  <span className="text-xs text-zinc-500">
                    {new Date(version.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-3">{version.content}</p>
                <button
                  onClick={() => onRestore(version)}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                >
                  {t("restoreVersion")}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
