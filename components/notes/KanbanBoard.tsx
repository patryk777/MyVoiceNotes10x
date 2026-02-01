"use client";

import { ArrowUpDown, CheckSquare, Lightbulb, FileText, Calendar } from "lucide-react";
import { Note, NoteCategory, NoteColor } from "@/hooks/useNotes";
import { NoteCard } from "@/components/notes/NoteCard";

interface KanbanBoardProps {
  notes: Note[];
  searchQuery: string;
  showArchive: boolean;
  sortOrder: Record<NoteCategory, "date" | "alpha">;
  onToggleSort: (category: NoteCategory) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, title: string, content: string, tags?: string[], color?: NoteColor, reminder?: number | null, images?: string[]) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
  onDrop: (e: React.DragEvent, category: NoteCategory) => void;
  onArchiveNote: (id: string) => void;
  onUnarchiveNote: (id: string) => void;
  onCategoryChange: (id: string, category: NoteCategory) => void;
  t: (key: string) => string;
}

const CATEGORIES: { id: NoteCategory; icon: React.ReactNode; color: string }[] = [
  { id: "tasks", icon: <CheckSquare className="w-4 h-4" />, color: "border-t-orange-500" },
  { id: "ideas", icon: <Lightbulb className="w-4 h-4" />, color: "border-t-yellow-500" },
  { id: "notes", icon: <FileText className="w-4 h-4" />, color: "border-t-blue-500" },
  { id: "meetings", icon: <Calendar className="w-4 h-4" />, color: "border-t-purple-500" },
];

export function KanbanBoard({
  notes,
  searchQuery,
  showArchive,
  sortOrder,
  onToggleSort,
  onDeleteNote,
  onUpdateNote,
  onDragStart,
  onDrop,
  onArchiveNote,
  onUnarchiveNote,
  onCategoryChange,
  t,
}: KanbanBoardProps) {
  const getFilteredNotesByCategory = (category: NoteCategory): Note[] => {
    const filtered = notes.filter((n) => {
      if (n.category !== category) return false;
      if (showArchive ? !n.archived : n.archived) return false;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    });

    const order = sortOrder[category];
    return filtered.sort((a, b) => {
      if (order === "alpha") {
        return a.title.localeCompare(b.title);
      }
      return b.createdAt - a.createdAt;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <section className="flex-1 p-2 sm:p-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 h-full min-w-0">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col bg-zinc-900/50 rounded-lg"
            onDrop={(e) => onDrop(e, cat.id)}
            onDragOver={handleDragOver}
          >
            <div className={`p-3 border-t-4 ${cat.color} rounded-t-lg`}>
              <div className="flex items-center gap-2 text-zinc-300">
                {cat.icon}
                <span className="font-medium">{t(cat.id)}</span>
                <button
                  onClick={() => onToggleSort(cat.id)}
                  className="ml-auto p-1 text-zinc-500 hover:text-zinc-300"
                  title={sortOrder[cat.id] === "date" ? "Sortuj alfabetycznie" : "Sortuj po dacie"}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
                <span className="text-zinc-500 text-sm">
                  {getFilteredNotesByCategory(cat.id).length}
                </span>
              </div>
            </div>

            <div className="flex-1 p-2 space-y-2">
              {getFilteredNotesByCategory(cat.id).map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={onDeleteNote}
                  onUpdate={onUpdateNote}
                  onDragStart={onDragStart}
                  onArchive={onArchiveNote}
                  onUnarchive={onUnarchiveNote}
                  onCategoryChange={onCategoryChange}
                />
              ))}
              {getFilteredNotesByCategory(cat.id).length === 0 && (
                <p className="text-zinc-600 text-sm text-center py-4">
                  {searchQuery ? t("noResults") || "Brak wyników" : t("dragOrRecord")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
