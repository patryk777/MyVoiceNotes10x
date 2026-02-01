"use client";

import { X, Sparkles, FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { exportSummaryToPdf } from "@/lib/export";

interface SummaryModalProps {
  summary: string;
  onClose: () => void;
  t: (key: string) => string;
}

export function SummaryModal({ summary, onClose, t }: SummaryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold">{t("summary")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto p-4 prose prose-invert prose-sm max-w-none
          prose-headings:text-zinc-200 prose-headings:font-semibold
          prose-p:text-zinc-300 prose-p:leading-relaxed
          prose-strong:text-zinc-100
          prose-ul:text-zinc-300 prose-li:my-1
          prose-ol:text-zinc-300"
        >
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
        <div className="p-3 sm:p-4 border-t border-zinc-700 flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={() => exportSummaryToPdf(summary)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4" />
            {t("exportPdf")}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 sm:py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm w-full sm:w-auto"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
