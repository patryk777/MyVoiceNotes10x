"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Note } from "@/hooks/useNotes";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, content: string) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
}

export function NoteCard({ note, onDelete, onUpdate, onDragStart }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [note.content]);

  const handleSave = () => {
    onUpdate(note.id, editTitle, editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Usuń notatkę?</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Czy na pewno chcesz usunąć "{note.title}"? Tej akcji nie można cofnąć.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  onDelete(note.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        draggable={!isEditing}
        onDragStart={(e) => onDragStart(e, note.id)}
        className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors group"
      >
        {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={6}
            className="w-full bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-sm text-zinc-300 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{editTitle.length} znaków w tytule</span>
            <span>{editContent.length} znaków w treści</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
            >
              <Check className="w-3 h-3" /> Zapisz
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-2 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-xs"
            >
              <X className="w-3 h-3" /> Anuluj
            </button>
          </div>
        </div>
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
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-zinc-500 hover:text-red-500"
                aria-label="Delete note"
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
