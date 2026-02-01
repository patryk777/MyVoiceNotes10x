"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import { useNotes, NoteCategory, Note } from "@/hooks/useNotes";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { RecordingSection } from "@/components/RecordingSection";
import { ActionBar } from "@/components/ActionBar";
import { SummaryModal } from "@/components/modals/SummaryModal";
import { KanbanBoard } from "@/components/notes/KanbanBoard";
import { HelpModal } from "@/components/modals/HelpModal";
import { exportToMarkdown, exportToPdf } from "@/lib/export";
import { LogOut } from "lucide-react";

const CATEGORIES_FOR_EXPORT = [
  { id: "tasks" as NoteCategory, label: "Zadania" },
  { id: "ideas" as NoteCategory, label: "Pomysły" },
  { id: "notes" as NoteCategory, label: "Notatki" },
  { id: "meetings" as NoteCategory, label: "Spotkania" },
];

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const { notes, saveNote, updateNoteCategory, updateNote, deleteNote, undo, canUndo, archiveNote, unarchiveNote } = useNotes();
  const { settings, updateSettings, t } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<Record<NoteCategory, "date" | "alpha">>({
    tasks: "date",
    ideas: "date",
    notes: "date",
    meetings: "date",
  });
  const [showArchive, setShowArchive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const processAudio = useCallback(
    async (blob: Blob) => {
      if (!blob || isProcessing) return;

      setIsProcessing(true);
      setProcessingStatus(t("transcribing"));

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
        setProcessingStatus(t("processing"));

        const processRes = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: transcript, language: settings.aiResponseLanguage }),
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
    },
    [isProcessing, saveNote, t]
  );

  const resetRecordingRef = useRef<(() => void) | null>(null);
  const { status, recordingTime, startRecording, stopRecording, resetRecording } = useRecorder(
    processAudio,
    settings.maxRecordingSeconds
  );
  resetRecordingRef.current = resetRecording;

  const handleMicClick = () => {
    if (status === "idle") {
      startRecording();
    } else if (status === "recording") {
      stopRecording();
    }
  };

  const getFilteredNotes = (): Note[] => {
    if (!searchQuery) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
    );
  };

  const handleExportMarkdown = () => {
    const filteredNotes = getFilteredNotes();
    const categories = CATEGORIES_FOR_EXPORT.map((c) => ({
      id: c.id,
      label: t(c.id) || c.label,
    }));
    exportToMarkdown(filteredNotes, categories, searchQuery);
  };

  const handleExportPdf = () => {
    const filteredNotes = getFilteredNotes();
    const categories = CATEGORIES_FOR_EXPORT.map((c) => ({
      id: c.id,
      label: t(c.id) || c.label,
    }));
    exportToPdf(filteredNotes, categories, searchQuery);
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

  const toggleSort = (category: NoteCategory) => {
    setSortOrder((prev) => ({
      ...prev,
      [category]: prev[category] === "date" ? "alpha" : "date",
    }));
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        if (notes.length > 0) {
          handleExportMarkdown();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
        if (notes.length > 0 && !isSummarizing) {
          generateSummary();
        }
      }
      if (e.key === "Escape" && summary) {
        setSummary(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, isProcessing, notes.length, isSummarizing, summary, startRecording, stopRecording, undo]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
          t={t}
        />
      )}

      {summary && (
        <SummaryModal summary={summary} onClose={() => setSummary(null)} t={t} />
      )}

      <section className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border-b border-zinc-800">
        <RecordingSection
          status={status}
          recordingTime={recordingTime}
          maxRecordingSeconds={settings.maxRecordingSeconds}
          isProcessing={isProcessing}
          processingStatus={processingStatus}
          onMicClick={handleMicClick}
          t={t}
        />

        <ActionBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showArchive={showArchive}
          onToggleArchive={() => setShowArchive(!showArchive)}
          canUndo={canUndo}
          onUndo={undo}
          onExportMarkdown={handleExportMarkdown}
          onExportPdf={handleExportPdf}
          onSummarize={generateSummary}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHelp={() => setShowHelp(true)}
          onLogout={logout}
          isSummarizing={isSummarizing}
          hasNotes={getFilteredNotes().length > 0}
          t={t}
        />
      </section>

      <KanbanBoard
        notes={notes}
        searchQuery={searchQuery}
        showArchive={showArchive}
        sortOrder={sortOrder}
        onToggleSort={toggleSort}
        onDeleteNote={deleteNote}
        onUpdateNote={updateNote}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onArchiveNote={archiveNote}
        onUnarchiveNote={unarchiveNote}
        onCategoryChange={updateNoteCategory}
        t={t}
      />

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
