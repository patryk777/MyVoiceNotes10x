import { Note, NoteCategory } from "@/hooks/useNotes";

interface CategoryInfo {
  id: NoteCategory;
  label: string;
}

function parseMarkdownToHtml(text: string): string {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)/gm, "<li>$1</li>")
    .replace(/\n/g, "<br>");
  
  if (html.includes("<li>")) {
    html = html.replace(/(<li>.*?<\/li>(<br>)?)+/g, (match) => 
      `<ul>${match.replace(/<br>/g, "")}</ul>`
    );
  }
  return html;
}

export function exportToMarkdown(
  notes: Note[],
  categories: CategoryInfo[],
  searchQuery: string
): void {
  if (notes.length === 0) return;

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);

  const markdown = categories
    .map((cat) => {
      const catNotes = notes
        .filter((n) => n.category === cat.id)
        .sort((a, b) => b.createdAt - a.createdAt);
      if (catNotes.length === 0) return "";
      return `## ${cat.label}\n\n${catNotes
        .map((n) => {
          const noteDate = new Date(n.createdAt).toLocaleString();
          return `### ${n.title}\n\n*${noteDate}*\n\n${n.content}\n\n---`;
        })
        .join("\n\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const header = searchQuery
    ? `# MyVoiceNotes Export\n\n**Filtr:** "${searchQuery}"\n**Eksport:** ${now.toLocaleString()}\n**Liczba notatek:** ${notes.length}\n\n`
    : `# MyVoiceNotes Export\n\n**Eksport:** ${now.toLocaleString()}\n**Liczba notatek:** ${notes.length}\n\n`;

  const blob = new Blob([header + markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${timestamp}_MyVoiceNotes${searchQuery ? `_${searchQuery.replace(/\s+/g, "-")}` : ""}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPdf(
  notes: Note[],
  categories: CategoryInfo[],
  searchQuery: string
): void {
  if (notes.length === 0) return;

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);

  const notesHtml = categories
    .map((cat) => {
      const catNotes = notes
        .filter((n) => n.category === cat.id)
        .sort((a, b) => b.createdAt - a.createdAt);
      if (catNotes.length === 0) return "";
      const notesContent = catNotes
        .map(
          (n) => {
            const imagesHtml = n.images && n.images.length > 0
              ? `<div class="note-images">${n.images.map(img => `<img src="${img}" alt="Note image" style="max-width:200px;max-height:200px;margin:5px;border-radius:4px;">`).join("")}</div>`
              : "";
            return `<div class="note"><h3>${n.title}</h3><div class="note-date">${new Date(n.createdAt).toLocaleString()}</div><div class="note-content">${parseMarkdownToHtml(n.content)}</div>${imagesHtml}</div>`;
          }
        )
        .join("");
      return `<h2>${cat.label}</h2>${notesContent}`;
    })
    .filter(Boolean)
    .join("");

  const filterHtml = searchQuery
    ? `<p><strong>Filtr:</strong> "${searchQuery}"</p>`
    : "";

  const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>MyVoiceNotes Export</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1a1a1a}h1{color:#e53e3e;border-bottom:2px solid #e53e3e;padding-bottom:10px}h2{color:#dd6b20;margin-top:30px}h3{color:#2d3748;margin-top:20px}.meta{color:#718096;font-size:14px;margin-bottom:30px}.note{background:#f7fafc;border-left:4px solid #4299e1;padding:15px;margin:15px 0;border-radius:0 8px 8px 0}.note-date{color:#a0aec0;font-size:12px;font-style:italic}.note-content{margin-top:10px;line-height:1.6}ul{padding-left:20px}li{margin:5px 0}@media print{body{padding:20px}}</style></head><body><h1>MyVoiceNotes Export</h1><div class="meta">${filterHtml}<p><strong>Eksport:</strong> ${now.toLocaleString()}</p><p><strong>Liczba notatek:</strong> ${notes.length}</p></div>${notesHtml}</body></html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.document.title = `${timestamp}_MyVoiceNotes${searchQuery ? "_" + searchQuery.replace(/\s+/g, "-") : ""}`;
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

export function exportSummaryToPdf(summary: string): void {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  
  const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Podsumowanie AI</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1a1a1a}h1{color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:10px}h2{color:#2563eb;margin-top:20px}ul{padding-left:20px}li{margin:8px 0}@media print{body{padding:20px}}</style></head><body><h1>Podsumowanie AI - MyVoiceNotes</h1><p><em>${now.toLocaleString()}</em></p>${summary.replace(/\n/g, "<br>").replace(/^## (.*)/gm, "<h2>$1</h2>").replace(/^- (.*)/gm, "<li>$1</li>")}</body></html>`;
  
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.document.title = `${timestamp}_Podsumowanie_AI`;
    setTimeout(() => printWindow.print(), 250);
  }
}
