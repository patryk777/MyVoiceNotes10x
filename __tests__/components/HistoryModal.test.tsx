import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { HistoryModal } from "@/components/modals/HistoryModal";
import { NoteVersion } from "@/hooks/useNotes";

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    history: "Historia zmian",
    restoreVersion: "Przywróć",
    noHistory: "Brak historii zmian",
  };
  return translations[key] || key;
};

describe("HistoryModal", () => {
  const mockVersions: NoteVersion[] = [
    { title: "Version 1", content: "Content 1", timestamp: 1000 },
    { title: "Version 2", content: "Content 2", timestamp: 2000 },
  ];

  const defaultProps = {
    versions: mockVersions,
    onRestore: jest.fn(),
    onClose: jest.fn(),
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title", () => {
    render(<HistoryModal {...defaultProps} />);
    
    expect(screen.getByText("Historia zmian")).toBeInTheDocument();
  });

  it("renders all versions", () => {
    render(<HistoryModal {...defaultProps} />);
    
    expect(screen.getByText("Version 1")).toBeInTheDocument();
    expect(screen.getByText("Version 2")).toBeInTheDocument();
  });

  it("shows version content", () => {
    render(<HistoryModal {...defaultProps} />);
    
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it("renders restore buttons for each version", () => {
    render(<HistoryModal {...defaultProps} />);
    
    const restoreButtons = screen.getAllByText("Przywróć");
    expect(restoreButtons.length).toBe(2);
  });

  it("calls onRestore with correct version when restore clicked", () => {
    render(<HistoryModal {...defaultProps} />);
    
    const restoreButtons = screen.getAllByText("Przywróć");
    fireEvent.click(restoreButtons[0]);
    
    expect(defaultProps.onRestore).toHaveBeenCalledWith(mockVersions[1]);
  });

  it("calls onClose when X button clicked", () => {
    render(<HistoryModal {...defaultProps} />);
    
    const buttons = screen.getAllByRole("button");
    const closeButton = buttons.find(btn => btn.querySelector("svg"));
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("shows no history message when versions is empty", () => {
    render(<HistoryModal {...defaultProps} versions={[]} />);
    
    expect(screen.getByText("Brak historii zmian")).toBeInTheDocument();
  });

  it("displays versions in reverse order (newest first)", () => {
    render(<HistoryModal {...defaultProps} />);
    
    const versionTitles = screen.getAllByText(/Version/);
    expect(versionTitles[0]).toHaveTextContent("Version 2");
    expect(versionTitles[1]).toHaveTextContent("Version 1");
  });
});
