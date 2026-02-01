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
          content: `Jesteś asystentem generującym tagi dla notatek. Na podstawie tytułu i treści notatki, zasugeruj 3-5 krótkich tagów (pojedyncze słowa lub krótkie frazy).
Tagi powinny być:
- Krótkie (1-2 słowa)
- Opisowe i konkretne
- W języku polskim
- Bez znaków specjalnych

Odpowiedz TYLKO listą tagów oddzielonych przecinkami, bez numeracji i dodatkowego tekstu.
Przykład: praca, pilne, projekt, deadline`,
        },
        {
          role: "user",
          content: `Tytuł: ${title}\n\nTreść: ${content}`,
        },
      ],
      max_tokens: 50,
    });

    const tagsString = response.choices[0]?.message?.content?.trim() || "";
    const tags = tagsString.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Tags suggestion error:", error);
    return NextResponse.json({ tags: [] });
  }
}
