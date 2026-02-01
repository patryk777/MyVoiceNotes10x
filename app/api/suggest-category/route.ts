import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Jesteś asystentem kategoryzującym notatki. Na podstawie tytułu i treści notatki, zasugeruj najlepszą kategorię.
Dostępne kategorie:
- tasks: zadania do wykonania, listy rzeczy do zrobienia, przypomnienia o działaniach
- ideas: pomysły, koncepcje, inspiracje, plany na przyszłość
- notes: ogólne notatki, informacje, zapiski
- meetings: spotkania, rozmowy, wydarzenia z innymi osobami

Odpowiedz TYLKO jednym słowem: tasks, ideas, notes lub meetings.`,
        },
        {
          role: "user",
          content: `Tytuł: ${title}\n\nTreść: ${content}`,
        },
      ],
      max_tokens: 10,
    });

    const category = response.choices[0]?.message?.content?.trim().toLowerCase();
    const validCategories = ["tasks", "ideas", "notes", "meetings"];
    
    return NextResponse.json({
      category: validCategories.includes(category || "") ? category : "notes",
    });
  } catch (error) {
    console.error("Category suggestion error:", error);
    return NextResponse.json({ category: "notes" });
  }
}
