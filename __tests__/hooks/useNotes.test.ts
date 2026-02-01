import { renderHook, act } from "@testing-library/react";
import { useNotes, NoteCategory } from "@/hooks/useNotes";

describe("useNotes", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize with empty notes", () => {
    const { result } = renderHook(() => useNotes());
    expect(result.current.notes).toEqual([]);
  });

  it("should save a new note", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Test Title", "Test Content", "tasks");
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].title).toBe("Test Title");
    expect(result.current.notes[0].content).toBe("Test Content");
    expect(result.current.notes[0].category).toBe("tasks");
  });

  it("should update note category", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Test", "Content", "tasks");
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.updateNoteCategory(noteId, "ideas");
    });

    expect(result.current.notes[0].category).toBe("ideas");
  });

  it("should delete a note", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Test", "Content", "tasks");
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.deleteNote(noteId);
    });

    expect(result.current.notes).toHaveLength(0);
  });

  it("should update note content", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Test", "Content", "tasks");
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(noteId, "Updated Title", "Updated Content");
    });

    expect(result.current.notes[0].title).toBe("Updated Title");
    expect(result.current.notes[0].content).toBe("Updated Content");
  });

  it("should archive and unarchive notes", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Test", "Content", "tasks");
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.archiveNote(noteId);
    });

    expect(result.current.notes[0].archived).toBe(true);

    act(() => {
      result.current.unarchiveNote(noteId);
    });

    expect(result.current.notes[0].archived).toBe(false);
  });

  it("should support undo functionality", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Test", "Content", "tasks");
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });

    expect(result.current.notes).toHaveLength(0);
  });

  it("should update note with tags and color", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Test", "Content", "tasks");
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(noteId, "Test", "Content", ["tag1", "tag2"], "blue");
    });

    expect(result.current.notes[0].tags).toEqual(["tag1", "tag2"]);
    expect(result.current.notes[0].color).toBe("blue");
  });

  it("should save version history on update", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.saveNote("transcript", "Original", "Original Content", "tasks");
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(noteId, "Updated", "Updated Content");
    });

    expect(result.current.notes[0].versions).toHaveLength(1);
    expect(result.current.notes[0].versions![0].title).toBe("Original");
    expect(result.current.notes[0].versions![0].content).toBe("Original Content");
  });
});
