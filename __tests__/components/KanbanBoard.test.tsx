import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { KanbanBoard } from "@/components/notes/KanbanBoard";
import { Note } from "@/hooks/useNotes";

jest.mock("@/components/notes/NoteCard", () => ({
  NoteCard: ({ note, onDelete }: { note: Note; onDelete: (id: string) => void }) => (
    <div data-testid={`note-${note.id}`}>
      <span>{note.title}</span>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  ),
}));

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    tasks: "Zadania",
    ideas: "Pomysły",
    notes: "Notatki",
    meetings: "Spotkania",
    dragOrRecord: "Przeciągnij lub nagraj",
    noResults: "Brak wyników",
  };
  return translations[key] || key;
};

const createNote = (overrides: Partial<Note> = {}): Note => ({
  id: crypto.randomUUID(),
  transcript: "Test transcript",
  title: "Test Note",
  content: "Test content",
  category: "notes",
  createdAt: Date.now(),
  ...overrides,
});

describe("KanbanBoard", () => {
  const defaultProps = {
    notes: [] as Note[],
    searchQuery: "",
    showArchive: false,
    sortOrder: { tasks: "date" as const, ideas: "date" as const, notes: "date" as const, meetings: "date" as const },
    onToggleSort: jest.fn(),
    onDeleteNote: jest.fn(),
    onUpdateNote: jest.fn(),
    onDragStart: jest.fn(),
    onDrop: jest.fn(),
    onArchiveNote: jest.fn(),
    onUnarchiveNote: jest.fn(),
    onCategoryChange: jest.fn(),
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all 4 category columns", () => {
    render(<KanbanBoard {...defaultProps} />);
    
    expect(screen.getByText("Zadania")).toBeInTheDocument();
    expect(screen.getByText("Pomysły")).toBeInTheDocument();
    expect(screen.getByText("Notatki")).toBeInTheDocument();
    expect(screen.getByText("Spotkania")).toBeInTheDocument();
  });

  it("shows empty state message when no notes", () => {
    render(<KanbanBoard {...defaultProps} />);
    
    const emptyMessages = screen.getAllByText("Przeciągnij lub nagraj");
    expect(emptyMessages.length).toBe(4);
  });

  it("renders notes in correct categories", () => {
    const notes = [
      createNote({ id: "1", title: "Task 1", category: "tasks" }),
      createNote({ id: "2", title: "Idea 1", category: "ideas" }),
      createNote({ id: "3", title: "Note 1", category: "notes" }),
    ];
    
    render(<KanbanBoard {...defaultProps} notes={notes} />);
    
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Idea 1")).toBeInTheDocument();
    expect(screen.getByText("Note 1")).toBeInTheDocument();
  });

  it("filters notes by search query", () => {
    const notes = [
      createNote({ id: "1", title: "Important Task", category: "tasks" }),
      createNote({ id: "2", title: "Random Note", category: "notes" }),
    ];
    
    render(<KanbanBoard {...defaultProps} notes={notes} searchQuery="Important" />);
    
    expect(screen.getByText("Important Task")).toBeInTheDocument();
    expect(screen.queryByText("Random Note")).not.toBeInTheDocument();
  });

  it("shows no results message when search has no matches", () => {
    const notes = [createNote({ id: "1", title: "Test", category: "tasks" })];
    
    render(<KanbanBoard {...defaultProps} notes={notes} searchQuery="xyz" />);
    
    expect(screen.getAllByText("Brak wyników").length).toBeGreaterThan(0);
  });

  it("filters archived notes correctly", () => {
    const notes = [
      createNote({ id: "1", title: "Active Note", category: "notes", archived: false }),
      createNote({ id: "2", title: "Archived Note", category: "notes", archived: true }),
    ];
    
    render(<KanbanBoard {...defaultProps} notes={notes} showArchive={false} />);
    
    expect(screen.getByText("Active Note")).toBeInTheDocument();
    expect(screen.queryByText("Archived Note")).not.toBeInTheDocument();
  });

  it("shows archived notes when showArchive is true", () => {
    const notes = [
      createNote({ id: "1", title: "Active Note", category: "notes", archived: false }),
      createNote({ id: "2", title: "Archived Note", category: "notes", archived: true }),
    ];
    
    render(<KanbanBoard {...defaultProps} notes={notes} showArchive={true} />);
    
    expect(screen.queryByText("Active Note")).not.toBeInTheDocument();
    expect(screen.getByText("Archived Note")).toBeInTheDocument();
  });

  it("calls onToggleSort when sort button clicked", () => {
    render(<KanbanBoard {...defaultProps} />);
    
    const sortButtons = screen.getAllByTitle(/Sortuj/);
    fireEvent.click(sortButtons[0]);
    
    expect(defaultProps.onToggleSort).toHaveBeenCalled();
  });

  it("sorts notes by date (newest first)", () => {
    const notes = [
      createNote({ id: "1", title: "Old Note", category: "notes", createdAt: 1000 }),
      createNote({ id: "2", title: "New Note", category: "notes", createdAt: 2000 }),
    ];
    
    render(<KanbanBoard {...defaultProps} notes={notes} />);
    
    const noteElements = screen.getAllByTestId(/note-/);
    expect(noteElements[0]).toHaveTextContent("New Note");
  });

  it("sorts notes alphabetically when sortOrder is alpha", () => {
    const notes = [
      createNote({ id: "1", title: "Zebra", category: "notes", createdAt: 2000 }),
      createNote({ id: "2", title: "Apple", category: "notes", createdAt: 1000 }),
    ];
    
    render(<KanbanBoard {...defaultProps} notes={notes} sortOrder={{ ...defaultProps.sortOrder, notes: "alpha" }} />);
    
    const noteElements = screen.getAllByTestId(/note-/);
    expect(noteElements[0]).toHaveTextContent("Apple");
  });

  it("shows correct note count in column header", () => {
    const notes = [
      createNote({ id: "1", category: "tasks" }),
      createNote({ id: "2", category: "tasks" }),
      createNote({ id: "3", category: "notes" }),
    ];
    
    render(<KanbanBoard {...defaultProps} notes={notes} />);
    
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls onDeleteNote when delete is triggered", () => {
    const notes = [createNote({ id: "test-id", title: "Test", category: "notes" })];
    
    render(<KanbanBoard {...defaultProps} notes={notes} />);
    
    fireEvent.click(screen.getByText("Delete"));
    expect(defaultProps.onDeleteNote).toHaveBeenCalledWith("test-id");
  });
});
