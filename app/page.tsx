"use client";

import { useState } from "react";
import { Mic, Square, Loader2, Trash2, CheckSquare, Lightbulb, FileText, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRecorder } from "@/hooks/useRecorder";
import { useNotes, NoteCategory, Note } from "@/hooks/useNotes";

const CATEGORIES: { id: NoteCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "tasks", label: "Zadania", icon: <CheckSquare className="w-4 h-4" />, color: "border-t-orange-500" },
  { id: "ideas", label: "Pomysły", icon: <Lightbulb className="w-4 h-4" />, color: "border-t-yellow-500" },
  { id: "notes", label: "Notatki", icon: <FileText className="w-4 h-4" />, color: "border-t-blue-500" },
  { id: "meetings", label: "Spotkania", icon: <Calendar className="w-4 h-4" />, color: "border-t-purple-500" },
];

export default function Home() {
  const { status, audioBlob, startRecording, stopRecording, resetRecording } = useRecorder();
  const { notes, saveNote, updateNoteCategory, deleteNote } = useNotes();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  const handleMicClick = async () => {
    if (status === "idle") {
      startRecording();
    } else if (status === "recording") {
      stopRecording();
    }
  };

  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setProcessingStatus("Transkrybuję...");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

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
        resetRecording();
      }
    } catch (err) {
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const isWorking = isProcessing;

  const getNotesByCategory = (category: NoteCategory): Note[] => {
    return notes.filter((n) => n.category === category);
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

  return (
    <div className="flex flex-col h-full">
      {/* Top: Recording section */}
      <section className="flex items-center justify-center gap-6 p-6 border-b border-zinc-800">
        <button
          onClick={handleMicClick}
          disabled={isWorking}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            status === "recording"
              ? "bg-red-600 animate-pulse"
              : status === "stopped"
              ? "bg-green-600 hover:bg-green-500"
              : "bg-red-600 hover:bg-red-500"
          } ${isWorking ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={status === "recording" ? "Stop recording" : "Start recording"}
        >
          {isWorking ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : status === "recording" ? (
            <Square className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        <div className="flex flex-col gap-2">
          {status === "idle" && !isWorking && (
            <p className="text-zinc-400">Kliknij, aby nagrać notatkę głosową</p>
          )}
          {status === "recording" && (
            <p className="text-red-400">Nagrywanie... Kliknij, aby zatrzymać</p>
          )}
          {status === "stopped" && audioBlob && !isWorking && (
            <div className="flex gap-3">
              <button
                onClick={processAudio}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium text-sm"
              >
                Przetwórz
              </button>
              <button
                onClick={resetRecording}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium text-sm"
              >
                Anuluj
              </button>
            </div>
          )}
          {processingStatus && (
            <p className="text-blue-400 text-sm">{processingStatus}</p>
          )}
        </div>
      </section>

      {/* Kanban board */}
      <section className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="w-80 flex-shrink-0 flex flex-col bg-zinc-900/50 rounded-lg"
              onDrop={(e) => handleDrop(e, cat.id)}
              onDragOver={handleDragOver}
            >
              {/* Column header */}
              <div className={`p-3 border-t-4 ${cat.color} rounded-t-lg`}>
                <div className="flex items-center gap-2 text-zinc-300">
                  {cat.icon}
                  <span className="font-medium">{cat.label}</span>
                  <span className="ml-auto text-zinc-500 text-sm">
                    {getNotesByCategory(cat.id).length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                {getNotesByCategory(cat.id).map((note) => (
                  <div
                    key={note.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, note.id)}
                    className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm text-zinc-200 line-clamp-2">
                        {note.title}
                      </h3>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        aria-label="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-zinc-400 line-clamp-3 prose prose-invert prose-xs">
                      <ReactMarkdown>{note.content}</ReactMarkdown>
                    </div>
                    <p className="text-xs text-zinc-600 mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {getNotesByCategory(cat.id).length === 0 && (
                  <p className="text-zinc-600 text-sm text-center py-4">
                    Przeciągnij lub nagraj
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
