"use client";

import { useState, useCallback, useRef } from "react";
import { Mic, Square, Loader2, CheckSquare, Lightbulb, FileText, Calendar, Search, Download, FileDown, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRecorder } from "@/hooks/useRecorder";
import { useNotes, NoteCategory, Note } from "@/hooks/useNotes";
import { NoteCard } from "@/components/NoteCard";

const CATEGORIES: { id: NoteCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "tasks", label: "Zadania", icon: <CheckSquare className="w-4 h-4" />, color: "border-t-orange-500" },
  { id: "ideas", label: "Pomysły", icon: <Lightbulb className="w-4 h-4" />, color: "border-t-yellow-500" },
  { id: "notes", label: "Notatki", icon: <FileText className="w-4 h-4" />, color: "border-t-blue-500" },
  { id: "meetings", label: "Spotkania", icon: <Calendar className="w-4 h-4" />, color: "border-t-purple-500" },
];

export default function Home() {
  const { notes, saveNote, updateNoteCategory, updateNote, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const processAudio = useCallback(async (blob: Blob) => {
    if (!blob || isProcessing) return;

    setIsProcessing(true);
    setProcessingStatus("Transkrybuję...");

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const transcribeData = await transcribeRes.json();
      if (!transcribeData.text) {
        throw new Error("Transcription failed");
      }

      const transcript = transcribeData.text;
      setProcessingStatus("Przetwarzam z AI...");

      const processRes = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: transcript }),
      });

      const data = await processRes.json();

      if (data.title && data.content && data.category) {
        saveNote(transcript, data.title, data.content, data.category);
      }
    } catch (err) {
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
      resetRecordingRef.current?.();
    }
  }, [isProcessing, saveNote]);

  const resetRecordingRef = useRef<(() => void) | null>(null);
  const { status, startRecording, stopRecording, resetRecording } = useRecorder(processAudio);
  resetRecordingRef.current = resetRecording;

  const handleMicClick = () => {
    if (status === "idle") {
      startRecording();
    } else if (status === "recording") {
      stopRecording();
    }
  };

  const isWorking = isProcessing;

  const getFilteredNotesByCategory = (category: NoteCategory): Note[] => {
    return notes.filter((n) => {
      if (n.category !== category) return false;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    });
  };

  const getFilteredNotes = (): Note[] => {
    if (!searchQuery) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
    );
  };

  const exportToMarkdown = () => {
    const filteredNotes = getFilteredNotes();
    if (filteredNotes.length === 0) return;

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    
    const markdown = CATEGORIES.map((cat) => {
      const catNotes = filteredNotes
        .filter((n) => n.category === cat.id)
        .sort((a, b) => b.createdAt - a.createdAt);
      if (catNotes.length === 0) return "";
      return `## ${cat.label}\n\n${catNotes
        .map((n) => {
          const noteDate = new Date(n.createdAt).toLocaleString("pl-PL");
          return `### ${n.title}\n\n*${noteDate}*\n\n${n.content}\n\n---`;
        })
        .join("\n\n")}`;
    })
      .filter(Boolean)
      .join("\n\n");

    const header = searchQuery 
      ? `# MyVoiceNotes Export\n\n**Filtr:** "${searchQuery}"\n**Eksport:** ${now.toLocaleString("pl-PL")}\n**Liczba notatek:** ${filteredNotes.length}\n\n`
      : `# MyVoiceNotes Export\n\n**Eksport:** ${now.toLocaleString("pl-PL")}\n**Liczba notatek:** ${filteredNotes.length}\n\n`;

    const blob = new Blob([header + markdown], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${timestamp}_MyVoiceNotes${searchQuery ? `_${searchQuery.replace(/\s+/g, "-")}` : ""}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    const filteredNotes = getFilteredNotes();
    if (filteredNotes.length === 0) return;

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);

    const notesHtml = CATEGORIES.map((cat) => {
      const catNotes = filteredNotes
        .filter((n) => n.category === cat.id)
        .sort((a, b) => b.createdAt - a.createdAt);
      if (catNotes.length === 0) return "";
      const notesContent = catNotes
        .map(
          (n) =>
            `<div class="note"><h3>${n.title}</h3><div class="note-date">${new Date(n.createdAt).toLocaleString("pl-PL")}</div><div class="note-content">${n.content.replace(/\n/g, "<br>")}</div></div>`
        )
        .join("");
      return `<h2>${cat.label}</h2>${notesContent}`;
    })
      .filter(Boolean)
      .join("");

    const filterHtml = searchQuery
      ? `<p><strong>Filtr:</strong> "${searchQuery}"</p>`
      : "";

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>MyVoiceNotes Export</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1a1a1a}h1{color:#e53e3e;border-bottom:2px solid #e53e3e;padding-bottom:10px}h2{color:#dd6b20;margin-top:30px}h3{color:#2d3748;margin-top:20px}.meta{color:#718096;font-size:14px;margin-bottom:30px}.note{background:#f7fafc;border-left:4px solid #4299e1;padding:15px;margin:15px 0;border-radius:0 8px 8px 0}.note-date{color:#a0aec0;font-size:12px;font-style:italic}.note-content{margin-top:10px;line-height:1.6}ul{padding-left:20px}li{margin:5px 0}@media print{body{padding:20px}}</style></head><body><h1>MyVoiceNotes Export</h1><div class="meta">${filterHtml}<p><strong>Eksport:</strong> ${now.toLocaleString("pl-PL")}</p><p><strong>Liczba notatek:</strong> ${filteredNotes.length}</p></div>${notesHtml}</body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.document.title = `${timestamp}_MyVoiceNotes${searchQuery ? "_" + searchQuery.replace(/\s+/g, "-") : ""}`;
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    e.dataTransfer.setData("noteId", noteId);
  };

  const handleDrop = (e: React.DragEvent, category: NoteCategory) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData("noteId");
    if (noteId) {
      updateNoteCategory(noteId, category);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const generateSummary = async () => {
    const filteredNotes = getFilteredNotes();
    if (filteredNotes.length === 0) return;

    setIsSummarizing(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: filteredNotes }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Summary error:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Summary Modal */}
      {summary && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold">Podsumowanie AI</h2>
              </div>
              <button
                onClick={() => setSummary(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 prose prose-invert prose-sm max-w-none
              prose-headings:text-zinc-200 prose-headings:font-semibold
              prose-p:text-zinc-300 prose-p:leading-relaxed
              prose-strong:text-zinc-100
              prose-ul:text-zinc-300 prose-li:my-1
              prose-ol:text-zinc-300">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
            <div className="p-3 sm:p-4 border-t border-zinc-700 flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => {
                  const now = new Date();
                  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
                  const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Podsumowanie AI</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1a1a1a}h1{color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:10px}h2{color:#2563eb;margin-top:20px}ul{padding-left:20px}li{margin:8px 0}@media print{body{padding:20px}}</style></head><body><h1>Podsumowanie AI - MyVoiceNotes</h1><p><em>${now.toLocaleString("pl-PL")}</em></p>${summary?.replace(/\n/g, "<br>").replace(/^## (.*)/gm, "<h2>$1</h2>").replace(/^- (.*)/gm, "<li>$1</li>")}</body></html>`;
                  const printWindow = window.open("", "_blank");
                  if (printWindow) {
                    printWindow.document.write(htmlContent);
                    printWindow.document.close();
                    printWindow.document.title = `${timestamp}_Podsumowanie_AI`;
                    setTimeout(() => printWindow.print(), 250);
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm w-full sm:w-auto"
              >
                <FileDown className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => setSummary(null)}
                className="px-4 py-2.5 sm:py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm w-full sm:w-auto"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top: Recording section */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <button
            onClick={handleMicClick}
            disabled={isWorking}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
              status === "recording"
                ? "bg-red-600 animate-pulse"
                : "bg-red-600 hover:bg-red-500"
            } ${isWorking ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={status === "recording" ? "Stop recording" : "Start recording"}
          >
            {isWorking ? (
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
            ) : status === "recording" ? (
              <Square className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </button>

          <div className="flex flex-col">
            {status === "idle" && !isWorking && (
              <p className="text-zinc-400 text-sm">Kliknij, aby nagrać</p>
            )}
            {status === "recording" && (
              <p className="text-red-400 text-sm">Nagrywanie...</p>
            )}
            {processingStatus && (
              <p className="text-blue-400 text-sm">{processingStatus}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Szukaj..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 w-full sm:w-48 lg:w-64"
            />
          </div>
          <button
            onClick={exportToMarkdown}
            disabled={getFilteredNotes().length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title={searchQuery ? "Export filtrowanych do .md" : "Export wszystkich do .md"}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">.md</span>
          </button>
          <button
            onClick={exportToPdf}
            disabled={getFilteredNotes().length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title={searchQuery ? "Export filtrowanych do .pdf" : "Export wszystkich do .pdf"}
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">.pdf</span>
          </button>
          <button
            onClick={generateSummary}
            disabled={getFilteredNotes().length === 0 || isSummarizing}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={searchQuery ? "Podsumuj przefiltrowane notatki" : "Podsumuj wszystkie notatki"}
          >
            {isSummarizing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Podsumuj</span>
          </button>
        </div>
      </section>

      {/* Kanban board */}
      <section className="flex-1 overflow-x-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 h-full min-w-0">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col bg-zinc-900/50 rounded-lg"
              onDrop={(e) => handleDrop(e, cat.id)}
              onDragOver={handleDragOver}
            >
              {/* Column header */}
              <div className={`p-3 border-t-4 ${cat.color} rounded-t-lg`}>
                <div className="flex items-center gap-2 text-zinc-300">
                  {cat.icon}
                  <span className="font-medium">{cat.label}</span>
                  <span className="ml-auto text-zinc-500 text-sm">
                    {getFilteredNotesByCategory(cat.id).length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                {getFilteredNotesByCategory(cat.id).map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={deleteNote}
                    onUpdate={updateNote}
                    onDragStart={handleDragStart}
                  />
                ))}
                {getFilteredNotesByCategory(cat.id).length === 0 && (
                  <p className="text-zinc-600 text-sm text-center py-4">
                    {searchQuery ? "Brak wyników" : "Przeciągnij lub nagraj"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
