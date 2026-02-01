import { NoteColor, NoteCategory } from "@/hooks/useNotes";

export const NOTE_COLORS: { id: NoteColor; bg: string; border: string }[] = [
  { id: "default", bg: "bg-zinc-800", border: "border-zinc-700" },
  { id: "red", bg: "bg-red-900/50", border: "border-red-700" },
  { id: "orange", bg: "bg-orange-900/50", border: "border-orange-700" },
  { id: "yellow", bg: "bg-yellow-900/50", border: "border-yellow-700" },
  { id: "green", bg: "bg-green-900/50", border: "border-green-700" },
  { id: "blue", bg: "bg-blue-900/50", border: "border-blue-700" },
  { id: "purple", bg: "bg-purple-900/50", border: "border-purple-700" },
  { id: "pink", bg: "bg-pink-900/50", border: "border-pink-700" },
];

export const CATEGORIES: { id: NoteCategory; labelPl: string; labelEn: string }[] = [
  { id: "tasks", labelPl: "Zadania", labelEn: "Tasks" },
  { id: "ideas", labelPl: "Pomysły", labelEn: "Ideas" },
  { id: "notes", labelPl: "Notatki", labelEn: "Notes" },
  { id: "meetings", labelPl: "Spotkania", labelEn: "Meetings" },
];

export const TRANSLATION_LANGUAGES = [
  { id: "angielski", label: "🇬🇧 Angielski", labelEn: "🇬🇧 English" },
  { id: "niemiecki", label: "🇩🇪 Niemiecki", labelEn: "🇩🇪 German" },
  { id: "francuski", label: "🇫🇷 Francuski", labelEn: "🇫🇷 French" },
  { id: "hiszpański", label: "🇪🇸 Hiszpański", labelEn: "🇪🇸 Spanish" },
  { id: "polski", label: "🇵🇱 Polski", labelEn: "🇵🇱 Polish" },
];

export const MAX_IMAGE_SIZE = 500000; // 500KB
