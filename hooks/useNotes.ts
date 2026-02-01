"use client";

import { useState, useEffect, useCallback } from "react";

export type NoteCategory = "tasks" | "ideas" | "notes" | "meetings";

export type NoteColor = "default" | "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink";

export interface NoteVersion {
  title: string;
  content: string;
  timestamp: number;
}

export interface Note {
  id: string;
  transcript: string;
  title: string;
  content: string;
  category: NoteCategory;
  createdAt: number;
  tags?: string[];
  color?: NoteColor;
  reminder?: number;
  archived?: boolean;
  versions?: NoteVersion[];
}

const STORAGE_KEY = "voice-to-structure-notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<Note[][]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  const pushHistory = useCallback((currentNotes: Note[]) => {
    setHistory((prev) => [...prev.slice(-9), currentNotes]);
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
        pushHistory(prev);
        const updated = [note, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      return note;
    },
    [pushHistory]
  );

  const updateNoteCategory = useCallback((id: string, category: NoteCategory) => {
    setNotes((prev) => {
      pushHistory(prev);
      const updated = prev.map((n) => (n.id === id ? { ...n, category } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [pushHistory]);

  const updateNote = useCallback((id: string, title: string, content: string, tags?: string[], color?: NoteColor, reminder?: number | null) => {
    setNotes((prev) => {
      pushHistory(prev);
      const updated = prev.map((n) => {
        if (n.id !== id) return n;
        const hasContentChanged = n.title !== title || n.content !== content;
        const newVersion: NoteVersion | null = hasContentChanged ? { title: n.title, content: n.content, timestamp: Date.now() } : null;
        return { 
          ...n, 
          title, 
          content, 
          tags: tags ?? n.tags, 
          color: color ?? n.color,
          reminder: reminder === null ? undefined : (reminder ?? n.reminder),
          versions: newVersion ? [...(n.versions || []).slice(-9), newVersion] : n.versions
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [pushHistory]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      pushHistory(prev);
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (history.length === 0) return false;
    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setNotes(previousState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(previousState));
    return true;
  }, [history]);

  const canUndo = history.length > 0;

  const archiveNote = useCallback((id: string) => {
    setNotes((prev) => {
      pushHistory(prev);
      const updated = prev.map((n) => (n.id === id ? { ...n, archived: true } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [pushHistory]);

  const unarchiveNote = useCallback((id: string) => {
    setNotes((prev) => {
      pushHistory(prev);
      const updated = prev.map((n) => (n.id === id ? { ...n, archived: false } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [pushHistory]);

  return { notes, saveNote, updateNoteCategory, updateNote, deleteNote, undo, canUndo, archiveNote, unarchiveNote };
}
