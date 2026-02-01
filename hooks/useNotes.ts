"use client";

import { useState, useEffect, useCallback } from "react";

export interface Note {
  id: string;
  transcript: string;
  content: string;
  createdAt: number;
}

const STORAGE_KEY = "voice-to-structure-notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  const saveNote = useCallback((transcript: string, content: string) => {
    const note: Note = {
      id: crypto.randomUUID(),
      transcript,
      content,
      createdAt: Date.now(),
    };
    setNotes((prev) => {
      const updated = [note, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return note;
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { notes, saveNote, deleteNote };
}
