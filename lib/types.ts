import { NoteCategory } from "@/hooks/useNotes";

export interface ProcessResponse {
  category: NoteCategory;
  title: string;
  content: string;
  error?: string;
}

export interface TranscribeResponse {
  text?: string;
  error?: string;
}

export interface SummarizeResponse {
  summary?: string;
  error?: string;
}

export interface SuggestCategoryResponse {
  category: NoteCategory;
}

export interface SuggestTagsResponse {
  tags: string[];
}

export interface TranslateResponse {
  title?: string;
  content?: string;
  error?: string;
}
