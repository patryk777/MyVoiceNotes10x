<div align="center">

# 🎙️ MyVoiceNotes10x

### AI-Powered Voice Notes - Zamień głos w uporządkowane notatki

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

[![Tests](https://img.shields.io/badge/Tests-195%20passed-success?style=flat-square)](./package.json)
[![CI](https://github.com/patryk777/MyVoiceNotes10x/actions/workflows/test.yml/badge.svg)](https://github.com/patryk777/MyVoiceNotes10x/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/Coverage-87%25-brightgreen?style=flat-square)](./package.json)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](./LICENSE)
[![10xDevs](https://img.shields.io/badge/10xDevs-2.0-purple?style=flat-square)](https://10xdevs.pl)

**[Demo]([#-instrukcja-uruchomienia](https://myvoicenotes10x.vercel.app)** · **[Dokumentacja](#-instrukcja-uruchomienia)** · **[AI Manifest](./AI_MANIFEST.md)**

</div>

---

## 📋 O projekcie

> **MyVoiceNotes** to aplikacja do tworzenia notatek głosowych z automatyczną transkrypcją i kategoryzacją AI. Projekt powstał w ramach kursu **[10xDevs 2.0](https://10xdevs.pl)** jako alternatywa dla komercyjnych rozwiązań.

### ✨ Główne funkcje
| Funkcja | Opis |
|---------|------|
| 🎤 **Nagrywanie głosu** | Automatyczna transkrypcja z OpenAI Whisper |
| 🤖 **AI Processing** | Kategoryzacja i strukturyzacja z GPT-4o |
| 📊 **Kanban Board** | 4 kategorie: Zadania, Pomysły, Notatki, Spotkania |
| 🔍 **Wyszukiwanie** | Szybkie filtrowanie notatek |
| 📤 **Eksport** | Markdown i PDF |
| 🏷️ **Tagi i kolory** | Organizacja wizualna |
| ⏰ **Przypomnienia** | Ustawianie terminów |
| 📜 **Historia wersji** | Przywracanie poprzednich wersji |
| 🌍 **Wielojęzyczność** | Interfejs PL/EN, tłumaczenie notatek, język generowanych notatek AI |
| 📱 **Mobile First** | Responsywny design |
| 💡 **Tooltips** | Rozbudowane opisy przycisków z emoji |
| 🖼️ **Obrazki** | Dodawanie zdjęć z automatyczną kompresją do 450KB |
| 🔐 **Logowanie** | Prosty ekran logowania chroniący dostęp do aplikacji |

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

### Architektura

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Next.js 15 (App Router) + React 19 + Tailwind CSS 4        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Routes                              │
│  /api/transcribe  │  /api/process  │  /api/summarize        │
│  /api/suggest-*   │  /api/translate                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       OpenAI API                             │
│           Whisper (STT)  │  GPT-4o (Processing)             │
└─────────────────────────────────────────────────────────────┘

📦 Storage: localStorage (no database)
🔐 Auth: none (demo mode)
🌊 Streaming: Vercel AI SDK
```

## 🚀 Instrukcja uruchomienia

<details>
<summary><b>📋 Wymagania</b></summary>

- Node.js 18+
- npm lub yarn
- Klucz API OpenAI

</details>

### Instalacja

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

### Uruchomienie

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
```

### Zmienne środowiskowe

```env
OPENAI_API_KEY=sk-your-api-key-here
```

## 🧪 Testy

<div align="center">

| Typ | Ilość | Pokrycie |
|-----|-------|----------|
| **Unit (Jest)** | 195 | 87% |
| **E2E (Playwright)** | 41 | - |
| **Łącznie** | **236** | - |

**CI/CD:** GitHub Actions uruchamia testy przy każdym push/PR do `main`

</div>

<details>
<summary><b>📁 Struktura testów jednostkowych</b></summary>

```
__tests__/
├── hooks/
│   ├── useNotes.test.ts           (13 testów)
│   ├── useSettings.test.ts        (10 testów)
│   └── useRecorder.test.ts        (13 testów)
├── components/
│   ├── ActionBar.test.tsx         (14 testów)
│   ├── DeleteConfirmModal.test.tsx (7 testów)
│   ├── HistoryModal.test.tsx      (8 testów)
│   ├── KanbanBoard.test.tsx       (12 testów)
│   ├── NoteCard.test.tsx          (3 testy)
│   ├── NoteCard.extended.test.tsx (12 testów)
│   ├── NoteEditForm.test.tsx      (16 testów)
│   ├── RecordingSection.test.tsx  (10 testów)
│   ├── SettingsModal.test.tsx     (4 testy)
│   └── SummaryModal.test.tsx      (9 testów)
├── lib/
│   ├── constants.test.ts          (11 testów)
│   └── export.test.ts             (17 testów)
└── api/
    └── validation.test.ts         (16 testów)
```

</details>

<details>
<summary><b>🎭 Testy E2E (Playwright)</b></summary>

```bash
npm run test:e2e        # headless
npm run test:e2e:headed # z przeglądarką
npm run test:e2e:ui     # interaktywny UI
```

```
e2e/
├── app.spec.ts                    (21 testów)
│   ├── Page Load (3)
│   ├── Kanban Board (2)
│   ├── Search Functionality (2)
│   ├── Action Bar (3)
│   ├── Settings Modal (2)
│   ├── Recording Section (2)
│   ├── Keyboard Shortcuts (1)
│   ├── Archive Toggle (1)
│   ├── Summarize Feature (1)
│   ├── Accessibility (2)
│   ├── Dark Theme (1)
│   └── LocalStorage Persistence (1)
└── notes.spec.ts                  (20 testów)
    ├── Category Columns (4)
    ├── Export Buttons (2)
    ├── Settings Functionality (4)
    ├── Responsive Design (4)
    ├── Keyboard Shortcuts (3)
    └── Empty State (3)
```

</details>

## 🔒 Zabezpieczenia API

> ✅ **Zweryfikowano** - brak wycieków API keys, secrets bezpiecznie w `.env.local`

Wszystkie endpointy mają limity chroniące przed nadmiernym zużyciem tokenów:

| Endpoint | Limit | Opis |
|----------|-------|------|
| `/api/process` | 10,000 znaków | Max długość transkrypcji |
| `/api/summarize` | 50 notatek, 50,000 znaków | Max notatek i treści |
| `/api/suggest-category` | 5,000 znaków | Max input |
| `/api/suggest-tags` | 5,000 znaków | Max input |
| `/api/translate` | 10,000 znaków + whitelist | Max input + dozwolone języki |
| `/api/transcribe` | 25MB | Max rozmiar pliku audio |

## 🤖 AI Workflow

> **Ten projekt został w całości zbudowany przy użyciu [Windsurf Cascade](https://codeium.com/windsurf)** - AI-powered IDE.

### Dlaczego Windsurf?

**Windsurf IDE** to nie tylko edytor kodu - to pełnoprawny partner w programowaniu. Kluczowe zalety:

**🔧 Konfiguracja IDE:**
- **MCP Servers** - 9 podłączonych narzędzi (szczegóły poniżej)
- **Memories** - AI pamięta kontekst między sesjami
- **Checkpoints** - automatyczne zapisywanie stanu pracy
- **Multi-file editing** - edycja wielu plików jednocześnie

**🔌 MCP Servers użyte w projekcie:**

| Server | Zastosowanie |
|--------|--------------|
| **deepwiki** | Dokumentacja GitHub repos, pytania o biblioteki |
| **exa** | Web search, code context, company research |
| **fetch** | Pobieranie treści z URL |
| **filesystem** | Operacje na plikach i katalogach |
| **git** | Zarządzanie repozytorium (commit, branch, diff) |
| **mcp-playwright** | Automatyzacja przeglądarki, E2E testy |
| **memory** | Knowledge graph, persystencja kontekstu |
| **perplexity-ask** | AI-powered wyszukiwanie i odpowiedzi |
| **puppeteer** | Screenshoty, nawigacja, interakcje z DOM |
| **sequential-thinking** | Rozwiązywanie złożonych problemów krok po kroku |

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
4. **Testy generowane przez AI** - 169 testów jednostkowych
5. **Code Review przez AI** - refaktor i optymalizacja
6. **E2E testy Playwright** - 41 testów end-to-end

### Narzędzia AI użyte w projekcie:
- **Windsurf Cascade** - główne IDE i asystent
- **Gemini 3 Pro** - wsparcie dla złożonych promptów
- **OpenAI GPT-4o** - przetwarzanie notatek w aplikacji
- **OpenAI Whisper** - transkrypcja audio

Szczegóły promptów użytych w projekcie: [AI_MANIFEST.md](./AI_MANIFEST.md)

## 🚧 Plany rozwoju

> **Ta aplikacja ma realne przełożenie na moje codzienne życie** - używam jej do organizacji myśli i zadań. Docelowo ma być **Life Managerem** - centralnym hubem do zarządzania wszystkimi aspektami życia.

### Faza 1: Infrastruktura (Q1 2026)
- 🗄️ **Baza danych** - migracja z localStorage na PostgreSQL/Supabase
- 🔐 **Autentykacja** - logowanie przez OAuth (Google, GitHub)
- ☁️ **Sync w chmurze** - synchronizacja między urządzeniami
- 📱 **PWA** - instalowalna aplikacja mobilna

### Faza 2: Zaawansowane AI (Q2 2026)
- 🔗 **LangGraph** - multi-step workflow z pamięcią kontekstową
- 🧠 **RAG** - wyszukiwanie semantyczne w notatkach (embeddings + vector store)
- 🤖 **AI Agents** - automatyczne akcje na podstawie notatek
- 📊 **Analiza wzorców** - insights z historii notatek

### Faza 3: Life Manager (Q3-Q4 2026)
- 📅 **Integracja z kalendarzem** - Google Calendar, Outlook
- ✅ **Task Management** - Kanban z deadline'ami i priorytetami
- 💰 **Budżet** - śledzenie wydatków z głosu
- 🏃 **Habits** - tracking nawyków
- 🎯 **Goals** - cele długoterminowe z postępem
- 🔔 **Smart Notifications** - AI-driven przypomnienia

### Faza 4: Integracje (2027)
- 📧 **Email** - przetwarzanie maili na notatki/zadania
- 💬 **Slack/Teams** - integracja z komunikatorami
- 📝 **Notion/Obsidian** - eksport/import
- 🏠 **Smart Home** - sterowanie głosem przez notatki

### Filozofia rozwoju:
Projekt jest celowo zbudowany na **prostym stacku** (Next.js + localStorage), co pozwala na:
- Szybkie prototypowanie nowych funkcji
- Łatwe dodawanie zaawansowanych integracji AI
- Pełną kontrolę nad kodem bez vendor lock-in
- Stopniową migrację do bardziej złożonej architektury

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
│   └── page.tsx              # Main orchestrator
├── components/
│   ├── ActionBar.tsx         # Search, export, settings buttons
│   ├── RecordingSection.tsx  # Mic button and timer
│   ├── modals/               # Modal components
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── HistoryModal.tsx
│   │   ├── HelpModal.tsx
│   │   ├── SettingsModal.tsx
│   │   └── SummaryModal.tsx
│   └── notes/                # Note-related components
│       ├── KanbanBoard.tsx   # Kanban columns with drag-drop
│       ├── NoteCard.tsx      # Note card with actions
│       └── NoteEditForm.tsx  # Edit form with AI features
├── hooks/
│   ├── useNotes.ts           # Notes CRUD + localStorage
│   ├── useRecorder.ts        # Audio recording
│   └── useSettings.ts        # App settings + i18n
├── lib/
│   ├── constants.ts          # Colors, categories
│   ├── export.ts             # MD/PDF export logic
│   └── types.ts              # API response types
├── __tests__/                # 195 Jest tests (87% coverage)
├── e2e/                      # 41 Playwright E2E tests
├── __mocks__/                # Test mocks
├── vercel.json               # Vercel config (fra1 region)
├── .github/workflows/        # GitHub Actions CI
└── .windsurfrules            # AI assistant rules
```

## 📄 Licencja

ISC

## 👤 Autor

**Patryk Walkiewicz** - [GitHub](https://github.com/patryk777)

---

*Projekt kursu 10xdevs 2.0 - Zbudowany z ❤️ i AI*
