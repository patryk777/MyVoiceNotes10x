import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { notes } = await req.json();

  const notesText = notes
    .map((n: any) => `[${n.category}] ${n.title}: ${n.content}`)
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
}
