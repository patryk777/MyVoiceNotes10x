<div align="center">

# 🤖 AI Manifest - MyVoiceNotes10x

### Dokumentacja procesu tworzenia projektu z wykorzystaniem AI

[![Windsurf](https://img.shields.io/badge/Built%20with-Windsurf%20Cascade-6366f1?style=for-the-badge)](https://codeium.com/windsurf)
[![AI Powered](https://img.shields.io/badge/AI%20Powered-GPT--4o%20%2B%20Whisper-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

</div>

---

## 🤖 Narzędzia AI

| Narzędzie | Rola | Zastosowanie |
|-----------|------|-------------|
| **Windsurf Cascade** | Główny asystent | Pair programming, code generation, review |
| **Gemini 3 Pro** | Wsparcie | Złożone prompty, analiza |
| **OpenAI GPT-4o** | Backend | Przetwarzanie notatek, kategoryzacja |
| **OpenAI Whisper** | Backend | Transkrypcja audio (STT) |

## 📝 Główne prompty użyte w projekcie

### 1. Inicjalizacja projektu

```
Zbuduj aplikację "Voice to Structure" - notatki głosowe z AI.
Stack: Next.js 15, TypeScript, Tailwind CSS, Vercel AI SDK.
Architektura: localStorage, bez auth, streaming LLM.
```

### 2. Core Features

```
Dodaj nagrywanie audio z automatyczną transkrypcją Whisper.
Po transkrypcji przetwórz z GPT-4o na strukturyzowaną notatkę.
Kategoryzuj automatycznie: tasks, ideas, notes, meetings.
```

### 3. Kanban Board

```
Stwórz widok Kanban z 4 kolumnami.
Drag-and-drop między kategoriami.
Responsywny: 1 kolumna mobile, 2 tablet, 4 desktop.
```

### 4. Rozszerzenia UI

```
Dodaj:
- Konfirmację usunięcia notatki
- Sortowanie kolumn (data/alfabetycznie)
- Licznik znaków w trybie edycji
- Animacje drag-and-drop
- Skróty klawiszowe (Ctrl+R, Ctrl+E, Ctrl+Shift+S, Esc)
```

### 5. Zarządzanie notatkami

```
Dodaj:
- Undo z Ctrl+Z
- Tagi/etykiety
- Kolory notatek
- Przypomnienia/terminy
- Archiwizacja
- Historia wersji z przywracaniem
- Załączniki obrazów
```

### 6. AI Features

```
Dodaj:
- AI sugestia kategorii podczas edycji
- AI generowanie tagów
- Tłumaczenie notatek na różne języki
- Podsumowanie AI wszystkich notatek
```

### 7. Ustawienia

```
Dodaj ustawienia:
- Wybór języka interfejsu (PL/EN)
- Domyślny język tłumaczenia
- Limit nagrania (suwak 10s-5min)
```

### 8. Testy

```
Dodaj testy lokalne (bez API):
- Testy hooków (useNotes, useSettings, useRecorder)
- Testy komponentów (NoteCard, SettingsModal)
- Mock fetch dla AI features
```

### 9. Dokumentacja

```
Wygeneruj README.md z:
- Cel projektu
- Stack technologiczny
- Instrukcja uruchomienia
- Sekcja AI Workflow
Wygeneruj AI_MANIFEST.md z promptami.
```

## 📊 Statystyki projektu

<div align="center">

| Metryka | Wartość |
|---------|---------|
| **Commity** | 30+ |
| **Testy** | 210 (169 unit + 41 E2E) |
| **Pokrycie testami** | 87% |
| **Pliki** | 50+ |
| **Linie kodu** | ~4000 |
| **Komponenty** | 9 |
| **Hooki** | 3 |
| **API Routes** | 6 |

</div>

### 10. Refaktor

```
Zrób dokładne review kodu i popraw:
- Error handling w API routes
- Wydziel page.tsx na mniejsze komponenty (<200 linii)
- Wydziel logikę eksportu do lib/export.ts
- Dodaj typy dla API responses
```

### 11. Testy E2E

```
Dodaj testy Playwright E2E:
- Testy ładowania strony i UI
- Testy responsywności (mobile, tablet, desktop)
- Testy ustawień i modali
- Testy skrótów klawiszowych
- Testy empty state
```

### 12. Zabezpieczenia API

```
Dodaj zabezpieczenia przed nadmiernym zużyciem tokenów:
- Limity długości inputów dla każdego endpointu
- Walidacja typów i wymaganych pól
- Whitelist dozwolonych wartości (np. języki)
- Limity rozmiaru plików
```

## 🔄 Git Flow

Projekt używa feature branches:

```
main
├── feat/delete-confirmation
├── feat/sorting
├── feat/character-counter
├── feat/animations
├── feat/keyboard-shortcuts
├── feat/undo
├── feat/tags
├── feat/colors
├── feat/reminders
├── feat/archive
├── feat/version-history
├── feat/attachments
├── feat/ai-category
├── feat/ai-tags
├── feat/translation
├── feat/settings
├── test/components-hooks
├── feat/documentation
├── refactor/notecard-components
├── fix/code-review-issues
└── test/additional-coverage
```

## 🎯 Wnioski

### ✅ Co działało dobrze

| Praktyka | Efekt |
|----------|-------|
| **Iteracyjne budowanie** | Jedna funkcja na raz = mniej bugów |
| **Natychmiastowe testowanie** | Szybka weryfikacja w przeglądarce |
| **Konwencjonalne commity** | Czytelna historia zmian |
| **Feature branches** | Izolacja zmian, łatwy rollback |
| **`.windsurfrules`** | AI rozumie kontekst projektu |

### ⚠️ Wyzwania

| Problem | Rozwiązanie |
|---------|------------|
| ESM modules w testach | Mocki dla react-markdown |
| MediaRecorder API | Mockowanie w Jest |
| Streaming responses | Vercel AI SDK |
| Playwright selectors | Dopasowanie do rzeczywistego UI |

### 💡 Rekomendacje dla przyszłych projektów

1. **Definiuj reguły** - `.windsurfrules` z best practices
2. **Używaj checkpointów** - zachowanie kontekstu między sesjami
3. **Testuj wcześnie** - każda funkcja przed przejściem dalej
4. **Commituj często** - conventional commits
5. **Dokumentuj prompty** - AI_MANIFEST dla reprodukowalności

---

<div align="center">

**Wygenerowano przez [Windsurf Cascade](https://codeium.com/windsurf)** | Projekt kursu [10xDevs 2.0](https://10xdevs.pl)

</div>
