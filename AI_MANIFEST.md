# AI Manifest - MyVoiceNotes10x

> Dokumentacja procesu tworzenia projektu z wykorzystaniem AI

## 🤖 Narzędzia AI

| Narzędzie | Rola |
|-----------|------|
| **Windsurf Cascade** | Główny asystent programistyczny, pair programming |
| **Gemini 3 Pro** | Wsparcie dla złożonych promptów |
| **OpenAI GPT-4o** | Przetwarzanie notatek w aplikacji |
| **OpenAI Whisper** | Transkrypcja audio |

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

| Metryka | Wartość |
|---------|---------|
| **Commity** | 25+ |
| **Testy** | 70 |
| **Pliki** | 40+ |
| **Linie kodu** | ~3500 |
| **Komponenty** | 9 |
| **Hooki** | 3 |
| **API Routes** | 6 |

### 10. Refaktor

```
Zrób dokładne review kodu i popraw:
- Error handling w API routes
- Wydziel page.tsx na mniejsze komponenty (<200 linii)
- Wydziel logikę eksportu do lib/export.ts
- Dodaj typy dla API responses
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
└── fix/code-review-issues
```

## 🎯 Wnioski

### Co działało dobrze:

1. **Iteracyjne budowanie** - jedna funkcja na raz
2. **Natychmiastowe testowanie** - weryfikacja w przeglądarce
3. **Konwencjonalne commity** - czytelna historia
4. **Feature branches** - izolacja zmian

### Wyzwania:

1. **ESM modules w testach** - wymagały mocków (react-markdown)
2. **MediaRecorder API** - mockowanie w testach
3. **Streaming responses** - obsługa w React

### Rekomendacje:

1. Definiuj jasne reguły w `.windsurfrules`
2. Używaj checkpointów do zachowania kontekstu
3. Testuj każdą funkcję przed przejściem dalej
4. Commituj często z opisowymi wiadomościami

---

*Wygenerowano przez Windsurf Cascade*
