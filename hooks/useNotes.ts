"use client";

import { useState, useEffect, useCallback } from "react";

export type NoteCategory = "tasks" | "ideas" | "notes" | "meetings";

export interface Note {
  id: string;
  transcript: string;
  title: string;
  content: string;
  category: NoteCategory;
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

  const saveNote = useCallback(
    (transcript: string, title: string, content: string, category: NoteCategory) => {
      const note: Note = {
        id: crypto.randomUUID(),
        transcript,
        title,
        content,
        category,
        createdAt: Date.now(),
      };
      setNotes((prev) => {
        const updated = [note, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      return note;
    },
    []
  );

  const updateNoteCategory = useCallback((id: string, category: NoteCategory) => {
    setNotes((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, category } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { notes, saveNote, updateNoteCategory, deleteNote };
}
