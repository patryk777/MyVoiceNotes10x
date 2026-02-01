import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const NoteSchema = z.object({
  category: z.enum(["tasks", "ideas", "notes", "meetings"]).describe("Category based on content: tasks for action items/todos, ideas for creative thoughts/suggestions, meetings for meeting notes/appointments, notes for general information"),
  title: z.string().describe("Short, descriptive title (max 50 chars)"),
  content: z.string().describe("Well-structured markdown content with bullet points, headers if needed. Fix grammar, remove filler words."),
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Missing or invalid prompt" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: NoteSchema,
      prompt: `Transform this voice transcript into a structured note. Determine the best category based on content.

Transcript: ${prompt}`,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Process error:", error);
    return Response.json({ error: "Failed to process transcript" }, { status: 500 });
  }
}
