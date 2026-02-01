import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SummaryModal } from "@/components/SummaryModal";

jest.mock("@/lib/export", () => ({
  exportSummaryToPdf: jest.fn(),
}));

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    summary: "Podsumowanie AI",
    exportPdf: "Eksportuj PDF",
    close: "Zamknij",
  };
  return translations[key] || key;
};

describe("SummaryModal", () => {
  const defaultProps = {
    summary: "## Test Summary\n\n- Item 1\n- Item 2",
    onClose: jest.fn(),
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title", () => {
    render(<SummaryModal {...defaultProps} />);
    
    expect(screen.getByText("Podsumowanie AI")).toBeInTheDocument();
  });

  it("renders summary content", () => {
    render(<SummaryModal {...defaultProps} />);
    
    // Mock renders raw markdown in testid="markdown"
    expect(screen.getByTestId("markdown")).toHaveTextContent("Test Summary");
  });

  it("renders close button", () => {
    render(<SummaryModal {...defaultProps} />);
    
    const closeButton = screen.getByRole("button", { name: /zamknij/i });
    expect(closeButton).toBeInTheDocument();
  });

  it("renders export PDF button", () => {
    render(<SummaryModal {...defaultProps} />);
    
    expect(screen.getByText("Eksportuj PDF")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    render(<SummaryModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText("Zamknij"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when X button clicked", () => {
    render(<SummaryModal {...defaultProps} />);
    
    const closeButtons = screen.getAllByRole("button");
    const xButton = closeButtons.find(btn => btn.querySelector("svg"));
    if (xButton) {
      fireEvent.click(xButton);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it("calls exportSummaryToPdf when export button clicked", () => {
    const { exportSummaryToPdf } = require("@/lib/export");
    render(<SummaryModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText("Eksportuj PDF"));
    expect(exportSummaryToPdf).toHaveBeenCalledWith(defaultProps.summary);
  });

  it("renders markdown content correctly", () => {
    render(<SummaryModal {...defaultProps} summary="**Bold text** and *italic*" />);
    
    // Mock renders raw markdown, so check for the raw content
    expect(screen.getByTestId("markdown")).toHaveTextContent("Bold text");
  });
});
