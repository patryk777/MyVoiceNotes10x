import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    deleteConfirmTitle: "Usuń notatkę?",
    deleteConfirmText: "Czy na pewno chcesz usunąć",
    cannotUndo: "Tej akcji nie można cofnąć.",
    cancel: "Anuluj",
    delete: "Usuń",
  };
  return translations[key] || key;
};

describe("DeleteConfirmModal", () => {
  const defaultProps = {
    noteTitle: "Test Note",
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title", () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    expect(screen.getByText("Usuń notatkę?")).toBeInTheDocument();
  });

  it("shows note title in confirmation text", () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    expect(screen.getByText(/"Test Note"/)).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    expect(screen.getByText("Anuluj")).toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    expect(screen.getByText("Usuń")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button clicked", () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText("Anuluj"));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when delete button clicked", () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText("Usuń"));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows cannot undo warning", () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    expect(screen.getByText(/Tej akcji nie można cofnąć/)).toBeInTheDocument();
  });
});
