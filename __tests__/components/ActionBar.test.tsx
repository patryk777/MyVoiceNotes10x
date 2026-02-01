import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionBar } from "@/components/ActionBar";

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    settings: "Ustawienia",
    undo: "Cofnij",
    showArchive: "Pokaż archiwum",
    showActive: "Pokaż aktywne",
    search: "Szukaj...",
    summarize: "Podsumuj",
  };
  return translations[key] || key;
};

describe("ActionBar", () => {
  const defaultProps = {
    searchQuery: "",
    onSearchChange: jest.fn(),
    showArchive: false,
    onToggleArchive: jest.fn(),
    canUndo: false,
    onUndo: jest.fn(),
    onExportMarkdown: jest.fn(),
    onExportPdf: jest.fn(),
    onSummarize: jest.fn(),
    onOpenSettings: jest.fn(),
    isSummarizing: false,
    hasNotes: true,
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all buttons", () => {
    render(<ActionBar {...defaultProps} />);
    
    expect(screen.getByTitle("Ustawienia")).toBeInTheDocument();
    expect(screen.getByTitle("Cofnij (Ctrl+Z)")).toBeInTheDocument();
    expect(screen.getByTitle("Pokaż archiwum")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Szukaj...")).toBeInTheDocument();
  });

  it("calls onOpenSettings when settings button clicked", () => {
    render(<ActionBar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle("Ustawienia"));
    expect(defaultProps.onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("calls onUndo when undo button clicked", () => {
    render(<ActionBar {...defaultProps} canUndo={true} />);
    
    fireEvent.click(screen.getByTitle("Cofnij (Ctrl+Z)"));
    expect(defaultProps.onUndo).toHaveBeenCalledTimes(1);
  });

  it("disables undo button when canUndo is false", () => {
    render(<ActionBar {...defaultProps} canUndo={false} />);
    
    const undoButton = screen.getByTitle("Cofnij (Ctrl+Z)");
    expect(undoButton).toBeDisabled();
  });

  it("calls onToggleArchive when archive button clicked", () => {
    render(<ActionBar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle("Pokaż archiwum"));
    expect(defaultProps.onToggleArchive).toHaveBeenCalledTimes(1);
  });

  it("shows different title when showArchive is true", () => {
    render(<ActionBar {...defaultProps} showArchive={true} />);
    
    expect(screen.getByTitle("Pokaż aktywne")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in search", () => {
    render(<ActionBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText("Szukaj...");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("test");
  });

  it("calls onExportMarkdown when export MD button clicked", () => {
    render(<ActionBar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle("Export do .md"));
    expect(defaultProps.onExportMarkdown).toHaveBeenCalledTimes(1);
  });

  it("calls onExportPdf when export PDF button clicked", () => {
    render(<ActionBar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle("Export do .pdf"));
    expect(defaultProps.onExportPdf).toHaveBeenCalledTimes(1);
  });

  it("disables export buttons when hasNotes is false", () => {
    render(<ActionBar {...defaultProps} hasNotes={false} />);
    
    expect(screen.getByTitle("Export do .md")).toBeDisabled();
    expect(screen.getByTitle("Export do .pdf")).toBeDisabled();
  });

  it("calls onSummarize when summarize button clicked", () => {
    render(<ActionBar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle("Podsumuj notatki"));
    expect(defaultProps.onSummarize).toHaveBeenCalledTimes(1);
  });

  it("disables summarize button when isSummarizing is true", () => {
    render(<ActionBar {...defaultProps} isSummarizing={true} />);
    
    expect(screen.getByTitle("Podsumuj notatki")).toBeDisabled();
  });

  it("disables summarize button when hasNotes is false", () => {
    render(<ActionBar {...defaultProps} hasNotes={false} />);
    
    expect(screen.getByTitle("Podsumuj notatki")).toBeDisabled();
  });
});
