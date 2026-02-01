# MyVoiceNotes10x

> 🎙️ **AI-Powered Voice Notes** - Zamień głos w uporządkowane notatki z automatyczną kategoryzacją

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-153%20passed-green)](./package.json)

## 📋 Cel projektu

MyVoiceNotes to aplikacja do tworzenia notatek głosowych z automatyczną transkrypcją i kategoryzacją AI. Projekt powstał w ramach kursu **10xdevs 2.0** jako alternatywa dla komercyjnych rozwiązań.

### Główne funkcje:
- 🎤 **Nagrywanie głosu** z automatyczną transkrypcją (OpenAI Whisper)
- 🤖 **AI Processing** - automatyczna kategoryzacja i strukturyzacja (GPT-4o)
- 📊 **Kanban Board** - organizacja notatek w 4 kategoriach (Zadania, Pomysły, Notatki, Spotkania)
- 🔍 **Wyszukiwanie** - szybkie filtrowanie notatek
- 📤 **Eksport** - Markdown i PDF
- 🏷️ **Tagi i kolory** - organizacja wizualna
- ⏰ **Przypomnienia** - ustawianie terminów
- 📜 **Historia wersji** - przywracanie poprzednich wersji
- 🌍 **Wielojęzyczność** - interfejs PL/EN, tłumaczenie notatek
- 📱 **Mobile First** - responsywny design

## 🛠️ Stack technologiczny

| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| **Next.js** | 15 | App Router, Server Components |
| **TypeScript** | 5.9 | Type safety |
| **Tailwind CSS** | 4.0 | Styling |
| **Lucide React** | 0.563 | Ikony |
| **Vercel AI SDK** | 6.0 | Streaming LLM responses |
| **OpenAI** | - | Whisper (transkrypcja), GPT-4o (AI) |
| **Jest** | 30 | Testy jednostkowe |
| **React Testing Library** | 16 | Testy komponentów |

### Architektura:
- **No Database** - localStorage dla persystencji danych
- **No Auth** - aplikacja demo bez uwierzytelniania
- **Streaming** - strumieniowanie odpowiedzi LLM
- **FormData** - przesyłanie audio do backendu

## 🚀 Instrukcja uruchomienia

### Wymagania:
- Node.js 18+
- npm lub yarn
- Klucz API OpenAI

### Instalacja:

```bash
# Klonowanie repozytorium
git clone https://github.com/patryk777/MyVoiceNotes10x.git
cd MyVoiceNotes10x

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env.local
# Edytuj .env.local i dodaj OPENAI_API_KEY
```

### Uruchomienie:

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Testy
npm test
npm run test:watch
```

### Zmienne środowiskowe:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

## 🧪 Testy

Projekt zawiera **153 testy** jednostkowe:

```
__tests__/
├── hooks/
│   ├── useNotes.test.ts           (19 testów)
│   ├── useSettings.test.ts        (8 testów)
│   └── useRecorder.test.ts        (13 testów)
├── components/
│   ├── ActionBar.test.tsx         (14 testów)
│   ├── DeleteConfirmModal.test.tsx (7 testów)
│   ├── HistoryModal.test.tsx      (8 testów)
│   ├── KanbanBoard.test.tsx       (12 testów)
│   ├── NoteCard.test.tsx          (16 testów)
│   ├── NoteCard.extended.test.tsx (16 testów)
│   ├── RecordingSection.test.tsx  (10 testów)
│   ├── SettingsModal.test.tsx     (4 testy)
│   └── SummaryModal.test.tsx      (8 testów)
└── lib/
    ├── constants.test.ts          (14 testów)
    └── export.test.ts             (11 testów)
```

## 🤖 AI Workflow

> **Ten projekt został w całości zbudowany przy użyciu [Windsurf Cascade](https://codeium.com/windsurf)** - AI-powered IDE.

### Dlaczego Windsurf?

**Windsurf IDE** to nie tylko edytor kodu - to pełnoprawny partner w programowaniu. Kluczowe zalety:

**🔧 Konfiguracja IDE:**
- **MCP Servers** - podłączone narzędzia: Git, Filesystem, Playwright, Puppeteer, Memory, Perplexity, Exa, DeepWiki
- **Memories** - AI pamięta kontekst między sesjami
- **Checkpoints** - automatyczne zapisywanie stanu pracy
- **Multi-file editing** - edycja wielu plików jednocześnie

**📋 Plik `.windsurfrules` (167 linii):**
- Stack technologiczny i architektura
- Best practices (frontend, backend, SOLID)
- Git Flow z automatycznymi commit messages
- Konwencje nazewnictwa i struktury kodu
- Wskazówki debugowania
- Przygotowanie na przyszłe integracje (LangGraph, RAG)

**🚀 Efekt:**
Dzięki tej konfiguracji AI działa **niemal autonomicznie** - rozumie kontekst projektu, stosuje się do reguł i generuje spójny kod. Wystarczy powiedzieć:
- `"Commit"` → automatyczny git add + conventional commit
- `"review"` → pełny code review z poprawkami
- `"refactor"` → wydzielenie komponentów zgodnie z best practices

To pozwala na **bardzo szybkie dostarczanie funkcjonalności** bez ciągłego tłumaczenia kontekstu.

### Proces tworzenia:
1. **Pair Programming z AI** - Cascade jako asystent programistyczny
2. **Iteracyjne budowanie** - funkcja po funkcji z natychmiastowym testowaniem
3. **Git Flow** - feature branches z automatycznymi commit messages
4. **Testy generowane przez AI** - 70 testów jednostkowych
5. **Code Review przez AI** - refaktor i optymalizacja

### Narzędzia AI użyte w projekcie:
- **Windsurf Cascade** - główne IDE i asystent
- **Gemini 3 Pro** - wsparcie dla złożonych promptów
- **OpenAI GPT-4o** - przetwarzanie notatek w aplikacji
- **OpenAI Whisper** - transkrypcja audio

Szczegóły promptów użytych w projekcie: [AI_MANIFEST.md](./AI_MANIFEST.md)

## 🚧 Plany rozwoju

> **Ta aplikacja ma realne przełożenie na moje codzienne życie** - używam jej do organizacji myśli i zadań.

### Planowane funkcjonalności:
- 🔗 **LangGraph** - zaawansowane workflow AI z pamięcią kontekstową
- 🧠 **RAG** - wyszukiwanie semantyczne w notatkach
- 📅 **Integracja z kalendarzem** - automatyczne tworzenie wydarzeń
- 🔔 **Push notifications** - przypomnienia w czasie rzeczywistym
- ☁️ **Sync w chmurze** - synchronizacja między urządzeniami

### Filozofia rozwoju:
Projekt jest celowo zbudowany na **prostym stacku** (Next.js + localStorage), co pozwala na:
- Szybkie prototypowanie nowych funkcji
- Łatwe dodawanie zaawansowanych integracji AI
- Pełną kontrolę nad kodem bez vendor lock-in

## 📁 Struktura projektu

```
MyVoiceNotes10x/
├── app/
│   ├── api/
│   │   ├── transcribe/       # Whisper API
│   │   ├── process/          # GPT-4o processing
│   │   ├── summarize/        # AI summary
│   │   ├── suggest-category/ # AI category
│   │   ├── suggest-tags/     # AI tags
│   │   └── translate/        # Translation
│   ├── layout.tsx
│   └── page.tsx              # Main orchestrator (230 linii)
├── components/
│   ├── ActionBar.tsx         # Search, export, settings buttons
│   ├── KanbanBoard.tsx       # Kanban columns with drag-drop
│   ├── NoteCard.tsx          # Note card (220 linii)
│   ├── NoteEditForm.tsx      # Edit form with AI features
│   ├── RecordingSection.tsx  # Mic button and timer
│   ├── SettingsModal.tsx     # App settings modal
│   ├── SummaryModal.tsx      # AI summary modal
│   └── modals/
│       ├── DeleteConfirmModal.tsx
│       └── HistoryModal.tsx
├── hooks/
│   ├── useNotes.ts           # Notes CRUD + localStorage
│   ├── useRecorder.ts        # Audio recording
│   └── useSettings.ts        # App settings + i18n
├── lib/
│   ├── constants.ts          # Colors, categories
│   ├── export.ts             # MD/PDF export logic
│   └── types.ts              # API response types
├── __tests__/                # 70 Jest tests
└── __mocks__/                # Test mocks
```

## 📄 Licencja

ISC

## 👤 Autor

**Patryk Walkiewicz** - [GitHub](https://github.com/patryk777)

---

*Projekt kursu 10xdevs 2.0 - Zbudowany z ❤️ i AI*
