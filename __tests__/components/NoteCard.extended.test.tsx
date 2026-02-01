import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NoteCard } from "@/components/notes/NoteCard";
import { Note } from "@/hooks/useNotes";

// Mock fetch for AI features
global.fetch = jest.fn();

const mockNote: Note = {
  id: "test-id-1",
  transcript: "Test transcript",
  title: "Test Note Title",
  content: "Test note content",
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

describe("NoteCard - Extended Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  describe("Color selection", () => {
    it("should show color buttons in edit mode", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      // Should have color buttons
      expect(screen.getByTitle("default")).toBeInTheDocument();
      expect(screen.getByTitle("red")).toBeInTheDocument();
      expect(screen.getByTitle("blue")).toBeInTheDocument();
    });

    it("should apply selected color on save", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      fireEvent.click(screen.getByTitle("blue"));
      fireEvent.click(screen.getByRole("button", { name: /zapisz|save/i }));
      
      expect(mockHandlers.onUpdate).toHaveBeenCalled();
      const call = mockHandlers.onUpdate.mock.calls[0];
      expect(call[0]).toBe("test-id-1");
      expect(call[4]).toBe("blue"); // color is 5th argument
    });
  });

  describe("Tags editing", () => {
    it("should show tags input in edit mode", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      expect(screen.getByPlaceholderText(/tagi|tags/i)).toBeInTheDocument();
    });

    it("should save tags on update", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      const tagsInput = screen.getByPlaceholderText(/tagi|tags/i);
      fireEvent.change(tagsInput, { target: { value: "work, urgent" } });
      fireEvent.click(screen.getByRole("button", { name: /zapisz|save/i }));
      
      expect(mockHandlers.onUpdate).toHaveBeenCalled();
      const call = mockHandlers.onUpdate.mock.calls[0];
      expect(call[0]).toBe("test-id-1");
      expect(call[3]).toEqual(["work", "urgent"]); // tags is 4th argument
    });
  });

  describe("AI Category Suggestion", () => {
    it("should show AI category button in edit mode", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      expect(screen.getByRole("button", { name: /ai kategoria|ai category/i })).toBeInTheDocument();
    });

    it("should call API when AI category clicked", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ category: "ideas" }),
      });

      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      fireEvent.click(screen.getByRole("button", { name: /ai kategoria|ai category/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/suggest-category", expect.any(Object));
      });
    });
  });

  describe("AI Tags Suggestion", () => {
    it("should show generate tags button in edit mode", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      expect(screen.getByTitle(/generuj tagi|generate.*tags/i)).toBeInTheDocument();
    });

    it("should call API when generate tags clicked", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ tags: ["tag1", "tag2"] }),
      });

      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      fireEvent.click(screen.getByTitle(/generuj tagi|generate.*tags/i));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/suggest-tags", expect.any(Object));
      });
    });
  });

  describe("Translation", () => {
    it("should show translation dropdown in edit mode", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeInTheDocument();
    });

    it("should call API when translation selected", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ title: "Translated", content: "Translated content" }),
      });

      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      const dropdown = screen.getByRole("combobox");
      fireEvent.change(dropdown, { target: { value: "angielski" } });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/translate", expect.any(Object));
      });
    });
  });

  describe("Version History", () => {
    it("should show history button when versions exist", () => {
      const noteWithVersions: Note = {
        ...mockNote,
        versions: [
          { title: "Old Title", content: "Old Content", timestamp: Date.now() - 100000 },
        ],
      };
      render(<NoteCard note={noteWithVersions} {...mockHandlers} />);
      
      // History button has aria-label containing "history"
      const historyBtn = screen.getByLabelText(/history/i);
      expect(historyBtn).toBeInTheDocument();
    });

    it("should open history modal when clicked", () => {
      const noteWithVersions: Note = {
        ...mockNote,
        versions: [
          { title: "Old Title", content: "Old Content", timestamp: Date.now() - 100000 },
        ],
      };
      render(<NoteCard note={noteWithVersions} {...mockHandlers} />);
      
      fireEvent.click(screen.getByLabelText(/history/i));
      
      expect(screen.getByText("Old Title")).toBeInTheDocument();
    });
  });

  describe("Image attachments", () => {
    it("should show add image button in edit mode", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      
      expect(screen.getByText(/dodaj zdjęcie|add image/i)).toBeInTheDocument();
    });

    it("should display existing images", () => {
      const noteWithImages: Note = {
        ...mockNote,
        images: ["data:image/png;base64,test123"],
      };
      const { container } = render(<NoteCard note={noteWithImages} {...mockHandlers} />);
      
      const images = container.querySelectorAll("img[src^='data:image']");
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe("Drag and Drop", () => {
    it("should call onDragStart when dragging", () => {
      render(<NoteCard note={mockNote} {...mockHandlers} />);
      
      const card = screen.getByText("Test Note Title").closest("[draggable]");
      if (card) {
        fireEvent.dragStart(card);
        expect(mockHandlers.onDragStart).toHaveBeenCalled();
      }
    });
  });

  describe("Expand/Collapse", () => {
    it("should expand content when title clicked", () => {
      const longNote: Note = {
        ...mockNote,
        content: "A".repeat(500),
      };
      render(<NoteCard note={longNote} {...mockHandlers} />);
      
      fireEvent.click(screen.getByText("Test Note Title"));
      
      // After click, should show full content
      expect(screen.getByText("A".repeat(500))).toBeInTheDocument();
    });
  });
});
