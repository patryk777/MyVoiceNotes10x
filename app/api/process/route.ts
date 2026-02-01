import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const NoteSchema = z.object({
  category: z.enum(["tasks", "ideas", "notes", "meetings"]).describe("Category based on content: tasks for action items/todos, ideas for creative thoughts/suggestions, meetings for meeting notes/appointments, notes for general information"),
  title: z.string().describe("Short, descriptive title (max 50 chars)"),
  content: z.string().describe("Well-structured markdown content with bullet points, headers if needed. Fix grammar, remove filler words."),
});

const MAX_PROMPT_LENGTH = 10000; // ~2500 tokens

export async function POST(req: Request) {
  try {
    const { prompt, language = "pl" } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Missing or invalid prompt" }, { status: 400 });
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return Response.json({ error: `Prompt too long (max ${MAX_PROMPT_LENGTH} chars)` }, { status: 400 });
    }

    const languageInstruction = language === "pl" 
      ? "IMPORTANT: Generate the title and content in Polish language."
      : "IMPORTANT: Generate the title and content in English language.";

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: NoteSchema,
      prompt: `Transform this voice transcript into a structured note. Determine the best category based on content.
${languageInstruction}

Transcript: ${prompt}`,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Process error:", error);
    return Response.json({ error: "Failed to process transcript" }, { status: 500 });
  }
}
