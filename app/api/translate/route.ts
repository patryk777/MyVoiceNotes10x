import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { title, content, targetLanguage } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Jesteś tłumaczem. Przetłumacz podany tekst na język ${targetLanguage}. Zachowaj formatowanie markdown jeśli jest obecne. Odpowiedz TYLKO przetłumaczonym tekstem, bez dodatkowych komentarzy.`,
        },
        {
          role: "user",
          content: `Tytuł: ${title}\n\nTreść: ${content}`,
        },
      ],
      max_tokens: 1000,
    });

    const translated = response.choices[0]?.message?.content?.trim() || "";
    const lines = translated.split("\n");
    const translatedTitle = lines[0]?.replace(/^Tytuł:\s*/i, "").trim() || title;
    const translatedContent = lines.slice(2).join("\n").replace(/^Treść:\s*/i, "").trim() || content;
    
    return NextResponse.json({ 
      title: translatedTitle,
      content: translatedContent 
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
