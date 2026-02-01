"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, Pencil, Bell, Archive, ArchiveRestore, History } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Note, NoteColor, NoteCategory, NoteVersion } from "@/hooks/useNotes";
import { NOTE_COLORS } from "@/lib/constants";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { HistoryModal } from "@/components/modals/HistoryModal";
import { NoteEditForm } from "@/components/NoteEditForm";
import { useSettings } from "@/hooks/useSettings";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, content: string, tags?: string[], color?: NoteColor, reminder?: number | null, images?: string[]) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onCategoryChange?: (id: string, category: NoteCategory) => void;
}

export function NoteCard({ note, onDelete, onUpdate, onDragStart, onArchive, onUnarchive, onCategoryChange }: NoteCardProps) {
  const { t } = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [restoredVersion, setRestoredVersion] = useState<NoteVersion | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [note.content]);

  const handleSave = (title: string, content: string, tags: string[], color: NoteColor, reminder: number | null, images: string[]) => {
    onUpdate(note.id, title, content, tags, color, reminder, images);
    setIsEditing(false);
    setRestoredVersion(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRestoredVersion(null);
  };

  const handleRestoreVersion = (version: NoteVersion) => {
    setRestoredVersion(version);
    setShowHistory(false);
    setIsEditing(true);
  };

  const colorStyle = NOTE_COLORS.find((c) => c.id === (note.color || "default")) || NOTE_COLORS[0];

  return (
    <>
      {showDeleteConfirm && (
        <DeleteConfirmModal
          noteTitle={note.title}
          onConfirm={() => {
            onDelete(note.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          t={t}
        />
      )}

      {showHistory && note.versions && note.versions.length > 0 && (
        <HistoryModal
          versions={note.versions}
          onRestore={handleRestoreVersion}
          onClose={() => setShowHistory(false)}
          t={t}
        />
      )}

      <div
        draggable={!isEditing}
        onDragStart={(e) => {
          setIsDragging(true);
          onDragStart(e, note.id);
        }}
        onDragEnd={() => setIsDragging(false)}
        className={`${colorStyle.bg} rounded-lg p-3 border ${colorStyle.border} cursor-grab active:cursor-grabbing hover:brightness-110 transition-all duration-200 group ${
          isDragging ? "opacity-50 scale-95 rotate-2 shadow-xl" : ""
        }`}
      >
        {isEditing ? (
          <NoteEditForm
            initialTitle={restoredVersion?.title || note.title}
            initialContent={restoredVersion?.content || note.content}
            initialTags={note.tags || []}
            initialColor={note.color || "default"}
            initialReminder={note.reminder}
            initialImages={note.images || []}
            noteId={note.id}
            onSave={handleSave}
            onCancel={handleCancel}
            onCategoryChange={onCategoryChange}
            t={t}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-medium text-sm text-zinc-200 line-clamp-2 cursor-pointer hover:text-white"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {note.title}
              </h3>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-zinc-500 hover:text-blue-400"
                  aria-label="Edit note"
                  title="Edytuj notatkę"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {note.versions && note.versions.length > 0 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="p-1 text-zinc-500 hover:text-blue-400"
                    aria-label="View history"
                    title="Historia wersji"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>
                )}
                {note.archived ? (
                  onUnarchive && (
                    <button
                      onClick={() => onUnarchive(note.id)}
                      className="p-1 text-zinc-500 hover:text-green-400"
                      aria-label="Restore from archive"
                      title="Przywróć z archiwum"
                    >
                      <ArchiveRestore className="w-3.5 h-3.5" />
                    </button>
                  )
                ) : (
                  onArchive && (
                    <button
                      onClick={() => onArchive(note.id)}
                      className="p-1 text-zinc-500 hover:text-yellow-400"
                      aria-label="Archive note"
                      title="Archiwizuj notatkę"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1 text-zinc-500 hover:text-red-500"
                  aria-label="Delete note"
                  title="Usuń notatkę"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={contentRef}
              className={`mt-2 text-xs text-zinc-300 prose prose-invert prose-xs 
                prose-headings:text-zinc-200 prose-headings:font-semibold prose-headings:mt-2 prose-headings:mb-1
                prose-p:my-1 prose-p:leading-relaxed
                prose-strong:text-zinc-100 prose-strong:font-semibold
                prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5
                prose-ol:my-1 prose-ol:pl-4
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                ${isExpanded ? "" : "line-clamp-3"}`}
            >
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>

            {note.images && note.images.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.images.map((img, idx) => (
                  <img key={idx} src={img} alt="" className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80" onClick={() => window.open(img, "_blank")} />
                ))}
              </div>
            )}

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-zinc-700 text-zinc-300 text-[10px] rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {note.reminder && (
              <div className={`flex items-center gap-1 mt-2 text-[10px] ${note.reminder < Date.now() ? "text-red-400" : "text-yellow-400"}`}>
                <Bell className="w-3 h-3" />
                <span>{new Date(note.reminder).toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-zinc-600">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
              {(isTruncated || isExpanded) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-zinc-500 hover:text-zinc-300 p-1"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
