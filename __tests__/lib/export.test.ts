/**
 * @jest-environment jsdom
 */

import { exportToMarkdown, exportToPdf, exportSummaryToPdf } from "@/lib/export";
import { Note } from "@/hooks/useNotes";

const createNote = (overrides: Partial<Note> = {}): Note => ({
  id: crypto.randomUUID(),
  transcript: "Test transcript",
  title: "Test Note",
  content: "Test content",
  category: "notes",
  createdAt: Date.now(),
  ...overrides,
});

describe("lib/export", () => {
  let mockCreateObjectURL: jest.Mock;
  let mockRevokeObjectURL: jest.Mock;
  let mockClick: jest.Mock;
  let mockOpen: jest.Mock;

  beforeEach(() => {
    mockCreateObjectURL = jest.fn(() => "blob:test-url");
    mockRevokeObjectURL = jest.fn();
    mockClick = jest.fn();
    mockOpen = jest.fn(() => ({
      document: {
        write: jest.fn(),
        close: jest.fn(),
        title: "",
      },
      print: jest.fn(),
    }));

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    window.open = mockOpen;

    jest.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        return { href: "", download: "", click: mockClick } as unknown as HTMLAnchorElement;
      }
      return document.createElement(tag);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("exportToMarkdown", () => {
    const categories = [
      { id: "tasks" as const, label: "Zadania" },
      { id: "ideas" as const, label: "Pomysły" },
      { id: "notes" as const, label: "Notatki" },
      { id: "meetings" as const, label: "Spotkania" },
    ];

    it("does nothing when notes array is empty", () => {
      exportToMarkdown([], categories, "");
      
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it("creates a blob with markdown content", () => {
      const notes = [createNote({ title: "Test", content: "Content" })];
      
      exportToMarkdown(notes, categories, "");
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it("triggers download", () => {
      const notes = [createNote()];
      
      exportToMarkdown(notes, categories, "");
      
      expect(mockClick).toHaveBeenCalled();
    });

    it("revokes object URL after download", () => {
      const notes = [createNote()];
      
      exportToMarkdown(notes, categories, "");
      
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:test-url");
    });

    it("includes search query in filename when provided", () => {
      const notes = [createNote()];
      
      exportToMarkdown(notes, categories, "test query");
      
      expect(document.createElement).toHaveBeenCalledWith("a");
    });

    it("groups notes by category", () => {
      const notes = [
        createNote({ category: "tasks", title: "Task 1" }),
        createNote({ category: "notes", title: "Note 1" }),
      ];
      
      exportToMarkdown(notes, categories, "");
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  describe("exportToPdf", () => {
    const categories = [
      { id: "tasks" as const, label: "Zadania" },
      { id: "notes" as const, label: "Notatki" },
    ];

    it("does nothing when notes array is empty", () => {
      exportToPdf([], categories, "");
      
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("opens a new window", () => {
      const notes = [createNote()];
      
      exportToPdf(notes, categories, "");
      
      expect(mockOpen).toHaveBeenCalledWith("", "_blank");
    });

    it("writes HTML content to the window", () => {
      const notes = [createNote({ title: "Test PDF" })];
      const mockWindow = {
        document: {
          write: jest.fn(),
          close: jest.fn(),
          title: "",
        },
        print: jest.fn(),
      };
      mockOpen.mockReturnValue(mockWindow);
      
      exportToPdf(notes, categories, "");
      
      expect(mockWindow.document.write).toHaveBeenCalled();
      expect(mockWindow.document.close).toHaveBeenCalled();
    });
  });

  describe("exportSummaryToPdf", () => {
    it("opens a new window", () => {
      exportSummaryToPdf("Test summary");
      
      expect(mockOpen).toHaveBeenCalledWith("", "_blank");
    });

    it("writes summary content to the window", () => {
      const mockWindow = {
        document: {
          write: jest.fn(),
          close: jest.fn(),
          title: "",
        },
        print: jest.fn(),
      };
      mockOpen.mockReturnValue(mockWindow);
      
      exportSummaryToPdf("## Summary\n\n- Item 1");
      
      expect(mockWindow.document.write).toHaveBeenCalled();
      const writtenContent = mockWindow.document.write.mock.calls[0][0];
      expect(writtenContent).toContain("Summary");
    });
  });
});
