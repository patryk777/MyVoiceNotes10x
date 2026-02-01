"use client";

import { useState, useRef } from "react";
import { Check, X, Bell, ImagePlus, Wand2, Loader2, Tags, Languages } from "lucide-react";
import { NoteColor, NoteCategory } from "@/hooks/useNotes";
import { NOTE_COLORS, TRANSLATION_LANGUAGES, MAX_IMAGE_SIZE } from "@/lib/constants";

interface NoteEditFormProps {
  initialTitle: string;
  initialContent: string;
  initialTags: string[];
  initialColor: NoteColor;
  initialReminder: number | undefined;
  initialImages: string[];
  noteId: string;
  onSave: (title: string, content: string, tags: string[], color: NoteColor, reminder: number | null, images: string[]) => void;
  onCancel: () => void;
  onCategoryChange?: (id: string, category: NoteCategory) => void;
  t: (key: string) => string;
}

export function NoteEditForm({
  initialTitle,
  initialContent,
  initialTags,
  initialColor,
  initialReminder,
  initialImages,
  noteId,
  onSave,
  onCancel,
  onCategoryChange,
  t,
}: NoteEditFormProps) {
  const [editTitle, setEditTitle] = useState(initialTitle);
  const [editContent, setEditContent] = useState(initialContent);
  const [editTags, setEditTags] = useState(initialTags.join(", "));
  const [editColor, setEditColor] = useState<NoteColor>(initialColor);
  const [editReminder, setEditReminder] = useState(
    initialReminder ? new Date(initialReminder).toISOString().slice(0, 16) : ""
  );
  const [editImages, setEditImages] = useState<string[]>(initialImages);
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<NoteCategory | null>(null);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const tags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    const reminder = editReminder ? new Date(editReminder).getTime() : null;
    onSave(editTitle, editContent, tags, editColor, reminder, editImages);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        alert("Plik jest za duży (max 500KB)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setEditImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const suggestCategory = async () => {
    if (!editTitle && !editContent) return;
    setIsSuggestingCategory(true);
    setSuggestedCategory(null);
    try {
      const res = await fetch("/api/suggest-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const data = await res.json();
      const validCategories: NoteCategory[] = ["tasks", "ideas", "notes", "meetings"];
      if (validCategories.includes(data.category)) {
        setSuggestedCategory(data.category as NoteCategory);
      }
    } catch (err) {
      console.error("Category suggestion error:", err);
    } finally {
      setIsSuggestingCategory(false);
    }
  };

  const suggestTags = async () => {
    if (!editTitle && !editContent) return;
    setIsSuggestingTags(true);
    try {
      const res = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const data = await res.json();
      if (data.tags && data.tags.length > 0) {
        const currentTags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
        const newTags = [...new Set([...currentTags, ...data.tags])];
        setEditTags(newTags.join(", "));
      }
    } catch (err) {
      console.error("Tags suggestion error:", err);
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const translateNote = async (targetLanguage: string) => {
    if (!editTitle && !editContent) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent, targetLanguage }),
      });
      const data = await res.json();
      if (data.title) setEditTitle(data.title);
      if (data.content) setEditContent(data.content);
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const getCategoryLabel = (cat: NoteCategory): string => {
    const labels: Record<NoteCategory, string> = {
      tasks: t("tasks"),
      ideas: t("ideas"),
      notes: t("notes"),
      meetings: t("meetings"),
    };
    return labels[cat];
  };

  return (
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
      
      {/* Tags */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
            placeholder={t("tags")}
            className="flex-1 bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={suggestTags}
            disabled={isSuggestingTags || (!editTitle && !editContent)}
            className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs disabled:opacity-50"
            title={t("generateTagsAI")}
          >
            {isSuggestingTags ? <Loader2 className="w-3 h-3 animate-spin" /> : <Tags className="w-3 h-3" />}
          </button>
        </div>
        {editTags && (
          <div className="flex flex-wrap gap-1">
            {editTags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-700 text-zinc-300 text-xs rounded"
              >
                #{tag}
                <button
                  onClick={() => {
                    const tags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
                    tags.splice(idx, 1);
                    setEditTags(tags.join(", "));
                  }}
                  className="text-zinc-400 hover:text-red-400"
                  title="Usuń tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="flex gap-1">
        {NOTE_COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => setEditColor(c.id)}
            className={`w-5 h-5 rounded ${c.bg} ${c.border} border ${editColor === c.id ? "ring-2 ring-white" : ""}`}
            title={c.id}
          />
        ))}
      </div>

      {/* Reminder */}
      <div className="flex items-center gap-2">
        <Bell className="w-3.5 h-3.5 text-zinc-500" />
        <input
          type="datetime-local"
          value={editReminder}
          onChange={(e) => setEditReminder(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
        />
        {editReminder && (
          <button onClick={() => setEditReminder("")} className="text-zinc-500 hover:text-red-400">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs"
        >
          <ImagePlus className="w-3 h-3" /> {t("addImage")}
        </button>
        {editImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {editImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Features */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={suggestCategory}
          disabled={isSuggestingCategory || (!editTitle && !editContent)}
          className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs disabled:opacity-50"
        >
          {isSuggestingCategory ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
          {t("aiCategory")}
        </button>
        {suggestedCategory && onCategoryChange && (
          <button
            onClick={() => {
              onCategoryChange(noteId, suggestedCategory);
              setSuggestedCategory(null);
            }}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            {t("moveTo")}: {getCategoryLabel(suggestedCategory)}
          </button>
        )}
        <div className="flex items-center gap-1">
          <Languages className="w-3 h-3 text-zinc-500" />
          <select
            onChange={(e) => e.target.value && translateNote(e.target.value)}
            disabled={isTranslating || (!editTitle && !editContent)}
            className="bg-zinc-900 border border-zinc-600 rounded px-1 py-0.5 text-xs text-zinc-300 disabled:opacity-50"
            defaultValue=""
          >
            <option value="" disabled>{t("translate")}</option>
            {TRANSLATION_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.label}</option>
            ))}
          </select>
          {isTranslating && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
        </div>
      </div>

      {/* Character count */}
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{editTitle.length} {t("charsInTitle")}</span>
        <span>{editContent.length} {t("charsInContent")}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
        >
          <Check className="w-3 h-3" /> {t("save")}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-2 py-1 bg-zinc-600 hover:bg-zinc-500 rounded text-xs"
        >
          <X className="w-3 h-3" /> {t("cancel")}
        </button>
      </div>
    </div>
  );
}
