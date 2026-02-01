"use client";

import { useState } from "react";
import { Mic, Square, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRecorder } from "@/hooks/useRecorder";
import { useNotes } from "@/hooks/useNotes";

export default function Home() {
  const { status, audioBlob, startRecording, stopRecording, resetRecording } = useRecorder();
  const { notes, saveNote, deleteNote } = useNotes();
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

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
    setStreamingContent("");
    
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

      const processRes = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: transcript }),
      });

      if (!processRes.body) {
        throw new Error("No response body");
      }

      const reader = processRes.body.getReader();
      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        content += chunk;
        setStreamingContent(content);
      }

      if (content) {
        saveNote(transcript, content);
        resetRecording();
        setStreamingContent("");
      }
    } catch (err) {
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isWorking = isProcessing;

  return (
    <div className="flex flex-col h-full">
      {/* Top: Mic button */}
      <section className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        <button
          onClick={handleMicClick}
          disabled={isWorking}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
            status === "recording"
              ? "bg-red-600 animate-pulse"
              : status === "stopped"
              ? "bg-green-600 hover:bg-green-500"
              : "bg-red-600 hover:bg-red-500"
          } ${isWorking ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={status === "recording" ? "Stop recording" : "Start recording"}
        >
          {isWorking ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : status === "recording" ? (
            <Square className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </button>

        {status === "recording" && (
          <p className="text-zinc-400">Nagrywanie... Kliknij, aby zatrzymać</p>
        )}

        {status === "stopped" && audioBlob && !isWorking && (
          <div className="flex gap-4">
            <button
              onClick={processAudio}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium"
            >
              Przetwórz nagranie
            </button>
            <button
              onClick={resetRecording}
              className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium"
            >
              Anuluj
            </button>
          </div>
        )}

        {streamingContent && (
          <div className="max-w-2xl w-full bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="prose prose-invert prose-sm">
              <ReactMarkdown>{streamingContent}</ReactMarkdown>
            </div>
          </div>
        )}
      </section>

      {/* Bottom: Notes grid */}
      <section className="p-6 border-t border-zinc-800">
        <h2 className="text-lg font-medium mb-4">Inteligentne Notatki ({notes.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 relative group"
            >
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="prose prose-invert prose-sm">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>
              <p className="text-xs text-zinc-500 mt-3">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-zinc-500 col-span-full text-center py-8">
              Brak notatek. Nagraj swoją pierwszą notatkę głosową!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
