"use client";

import { useState, useEffect } from "react";

export type AppLanguage = "pl" | "en";
export type TranslationLanguage = "angielski" | "niemiecki" | "francuski" | "hiszpański" | "polski";

export interface Settings {
  appLanguage: AppLanguage;
  defaultTranslationLanguage: TranslationLanguage;
  maxRecordingSeconds: number;
}

const DEFAULT_SETTINGS: Settings = {
  appLanguage: "pl",
  defaultTranslationLanguage: "angielski",
  maxRecordingSeconds: 60,
};

const STORAGE_KEY = "voice-to-structure-settings";

export const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  pl: {
    appTitle: "MyVoiceNotes",
    appSubtitle: "Zamień głos w uporządkowane notatki z automatyczną kategoryzacją",
    clickToRecord: "Kliknij, aby nagrać",
    recording: "Nagrywanie...",
    transcribing: "Transkrybuję...",
    processing: "Przetwarzam z AI...",
    search: "Szukaj...",
    summarize: "Podsumuj",
    showArchive: "Pokaż archiwum",
    showActive: "Pokaż aktywne",
    undo: "Cofnij",
    tasks: "Zadania",
    ideas: "Pomysły",
    notes: "Notatki",
    meetings: "Spotkania",
    dragOrRecord: "Przeciągnij lub nagraj",
    edit: "Edytuj",
    delete: "Usuń",
    archive: "Archiwizuj",
    restore: "Przywróć",
    save: "Zapisz",
    cancel: "Anuluj",
    deleteConfirmTitle: "Usuń notatkę?",
    deleteConfirmText: "Czy na pewno chcesz usunąć",
    cannotUndo: "Tej akcji nie można cofnąć.",
    tags: "Tagi (oddzielone przecinkami)",
    generateTagsAI: "Generuj tagi AI",
    aiCategory: "AI Kategoria",
    translate: "Tłumacz...",
    addImage: "Dodaj zdjęcie",
    charsInTitle: "znaków w tytule",
    charsInContent: "znaków w treści",
    moveTo: "Przenieś do",
    history: "Historia",
    restoreVersion: "Przywróć",
    noHistory: "Brak historii zmian",
    settings: "Ustawienia",
    appLanguageLabel: "Język interfejsu",
    translationLanguageLabel: "Domyślny język tłumaczenia",
    maxRecordingLabel: "Maksymalny czas nagrania",
    seconds: "sek",
    minutes: "min",
    close: "Zamknij",
    summary: "Podsumowanie AI",
    exportPdf: "Eksportuj PDF",
    reminder: "Przypomnienie",
  },
  en: {
    appTitle: "MyVoiceNotes",
    appSubtitle: "Turn voice into organized notes with automatic categorization",
    clickToRecord: "Click to record",
    recording: "Recording...",
    transcribing: "Transcribing...",
    processing: "Processing with AI...",
    search: "Search...",
    summarize: "Summarize",
    showArchive: "Show archive",
    showActive: "Show active",
    undo: "Undo",
    tasks: "Tasks",
    ideas: "Ideas",
    notes: "Notes",
    meetings: "Meetings",
    dragOrRecord: "Drag or record",
    edit: "Edit",
    delete: "Delete",
    archive: "Archive",
    restore: "Restore",
    save: "Save",
    cancel: "Cancel",
    deleteConfirmTitle: "Delete note?",
    deleteConfirmText: "Are you sure you want to delete",
    cannotUndo: "This action cannot be undone.",
    tags: "Tags (comma separated)",
    generateTagsAI: "Generate AI tags",
    aiCategory: "AI Category",
    translate: "Translate...",
    addImage: "Add image",
    charsInTitle: "chars in title",
    charsInContent: "chars in content",
    moveTo: "Move to",
    history: "History",
    restoreVersion: "Restore",
    noHistory: "No version history",
    settings: "Settings",
    appLanguageLabel: "Interface language",
    translationLanguageLabel: "Default translation language",
    maxRecordingLabel: "Maximum recording time",
    seconds: "sec",
    minutes: "min",
    close: "Close",
    summary: "AI Summary",
    exportPdf: "Export PDF",
    reminder: "Reminder",
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const t = (key: string): string => {
    return TRANSLATIONS[settings.appLanguage][key] || key;
  };

  return { settings, updateSettings, t, isLoaded };
}
