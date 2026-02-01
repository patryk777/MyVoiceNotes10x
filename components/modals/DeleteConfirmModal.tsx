"use client";

import { X } from "lucide-react";

interface DeleteConfirmModalProps {
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export function DeleteConfirmModal({ noteTitle, onConfirm, onCancel, t }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">{t("deleteConfirmTitle")}</h3>
        <p className="text-zinc-400 text-sm mb-4">
          {t("deleteConfirmText")} "{noteTitle}"? {t("cannotUndo")}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
