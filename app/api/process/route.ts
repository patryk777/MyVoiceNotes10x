import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are an intelligent note-taking assistant. Transform the user's voice transcript into a well-structured note. 
Use markdown formatting:
- Add a clear title
- Organize content with headers if needed
- Use bullet points for lists
- Highlight key points
- Fix grammar and remove filler words
Keep the original meaning and tone.`,
    prompt: prompt,
  });

  return result.toTextStreamResponse();
}
