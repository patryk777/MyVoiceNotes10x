import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

interface NoteInput {
  category: string;
  title: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return Response.json({ error: "Missing or invalid notes array" }, { status: 400 });
    }

    const notesText = notes
      .map((n: NoteInput) => `[${n.category}] ${n.title}: ${n.content}`)
      .join("\n\n");

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Przeanalizuj poniższe notatki i stwórz zwięzłe podsumowanie w języku polskim. 
Wyodrębnij:
- Kluczowe tematy i wątki
- Najważniejsze zadania do wykonania
- Główne pomysły i idee
- Nadchodzące spotkania lub terminy

Formatuj odpowiedź w markdown z nagłówkami i punktami.

NOTATKI:
${notesText}`,
    });

    return Response.json({ summary: text });
  } catch (error) {
    console.error("Summarize error:", error);
    return Response.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
