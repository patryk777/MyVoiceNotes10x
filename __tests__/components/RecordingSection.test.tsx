import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecordingSection } from "@/components/RecordingSection";

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    clickToRecord: "Kliknij, aby nagrać",
    recording: "Nagrywanie...",
  };
  return translations[key] || key;
};

describe("RecordingSection", () => {
  const defaultProps = {
    status: "idle" as const,
    recordingTime: 0,
    maxRecordingSeconds: 60,
    isProcessing: false,
    processingStatus: "",
    onMicClick: jest.fn(),
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders mic button", () => {
    render(<RecordingSection {...defaultProps} />);
    
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows click to record text when idle", () => {
    render(<RecordingSection {...defaultProps} />);
    
    expect(screen.getByText("Kliknij, aby nagrać")).toBeInTheDocument();
  });

  it("calls onMicClick when button clicked", () => {
    render(<RecordingSection {...defaultProps} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onMicClick).toHaveBeenCalledTimes(1);
  });

  it("shows recording time when recording", () => {
    render(<RecordingSection {...defaultProps} status="recording" recordingTime={15} />);
    
    expect(screen.getByText(/Nagrywanie.../)).toBeInTheDocument();
    expect(screen.getByText(/0:15/)).toBeInTheDocument();
  });

  it("shows max recording time", () => {
    render(<RecordingSection {...defaultProps} status="recording" recordingTime={0} maxRecordingSeconds={120} />);
    
    expect(screen.getByText(/2:00/)).toBeInTheDocument();
  });

  it("shows processing status when processing", () => {
    render(<RecordingSection {...defaultProps} isProcessing={true} processingStatus="Transkrybuję..." />);
    
    expect(screen.getByText("Transkrybuję...")).toBeInTheDocument();
  });

  it("disables button when processing", () => {
    render(<RecordingSection {...defaultProps} isProcessing={true} />);
    
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("has correct aria-label for idle state", () => {
    render(<RecordingSection {...defaultProps} />);
    
    expect(screen.getByLabelText("Start recording")).toBeInTheDocument();
  });

  it("has correct aria-label for recording state", () => {
    render(<RecordingSection {...defaultProps} status="recording" />);
    
    expect(screen.getByLabelText("Stop recording")).toBeInTheDocument();
  });

  it("formats minutes correctly", () => {
    render(<RecordingSection {...defaultProps} status="recording" recordingTime={125} maxRecordingSeconds={180} />);
    
    expect(screen.getByText(/2:05/)).toBeInTheDocument();
    expect(screen.getByText(/3:00/)).toBeInTheDocument();
  });
});
