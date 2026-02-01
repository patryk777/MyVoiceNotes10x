import { render, screen, fireEvent } from "@testing-library/react";
import { NoteCard } from "@/components/notes/NoteCard";
import { Note } from "@/hooks/useNotes";

const mockNote: Note = {
  id: "test-id-1",
  transcript: "Test transcript",
  title: "Test Note Title",
  content: "Test note content with **markdown**",
  category: "tasks",
  createdAt: Date.now(),
};

const mockHandlers = {
  onDelete: jest.fn(),
  onUpdate: jest.fn(),
  onDragStart: jest.fn(),
  onArchive: jest.fn(),
  onUnarchive: jest.fn(),
  onCategoryChange: jest.fn(),
};

describe("NoteCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render note title", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    expect(screen.getByText("Test Note Title")).toBeInTheDocument();
  });

  it("should render note content", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    expect(screen.getByText(/Test note content/)).toBeInTheDocument();
  });

  it("should show edit button", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("should show delete button", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("should show archive button for non-archived note", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    expect(screen.getByRole("button", { name: /archive/i })).toBeInTheDocument();
  });

  it("should show restore button for archived note", () => {
    const archivedNote = { ...mockNote, archived: true };
    render(<NoteCard note={archivedNote} {...mockHandlers} />);
    expect(screen.getByRole("button", { name: /restore/i })).toBeInTheDocument();
  });

  it("should enter edit mode when edit button clicked", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    
    expect(screen.getByDisplayValue("Test Note Title")).toBeInTheDocument();
  });

  it("should show delete confirmation when delete clicked", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    
    expect(screen.getByText(/Usuń notatkę\?|Delete note\?/)).toBeInTheDocument();
  });

  it("should call onDelete when confirmed", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Usuń$|^Delete$/i }));
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith("test-id-1");
  });

  it("should call onArchive when archive button clicked", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /archive/i }));
    
    expect(mockHandlers.onArchive).toHaveBeenCalledWith("test-id-1");
  });

  it("should call onUnarchive when restore button clicked", () => {
    const archivedNote = { ...mockNote, archived: true };
    render(<NoteCard note={archivedNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /restore/i }));
    
    expect(mockHandlers.onUnarchive).toHaveBeenCalledWith("test-id-1");
  });

  it("should display tags when present", () => {
    const noteWithTags = { ...mockNote, tags: ["urgent", "work"] };
    render(<NoteCard note={noteWithTags} {...mockHandlers} />);
    
    expect(screen.getByText("#urgent")).toBeInTheDocument();
    expect(screen.getByText("#work")).toBeInTheDocument();
  });

  it("should display reminder when present", () => {
    const futureDate = Date.now() + 86400000;
    const noteWithReminder = { ...mockNote, reminder: futureDate };
    render(<NoteCard note={noteWithReminder} {...mockHandlers} />);
    
    // Reminder displays date and time
    expect(screen.getByText(/\d{1,2}\.\d{2}\.\d{4}, \d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("should show character count in edit mode", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    
    expect(screen.getByText(/znaków w tytule|chars in title/)).toBeInTheDocument();
    expect(screen.getByText(/znaków w treści|chars in content/)).toBeInTheDocument();
  });

  it("should call onUpdate when save clicked", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    
    const titleInput = screen.getByDisplayValue("Test Note Title");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    
    fireEvent.click(screen.getByRole("button", { name: /zapisz|save/i }));
    
    expect(mockHandlers.onUpdate).toHaveBeenCalled();
  });

  it("should cancel edit mode when cancel clicked", () => {
    render(<NoteCard note={mockNote} {...mockHandlers} />);
    
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    
    const titleInput = screen.getByDisplayValue("Test Note Title");
    fireEvent.change(titleInput, { target: { value: "Changed Title" } });
    
    fireEvent.click(screen.getByRole("button", { name: /anuluj|cancel/i }));
    
    expect(screen.getByText("Test Note Title")).toBeInTheDocument();
  });
});
