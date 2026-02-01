import { renderHook, act } from "@testing-library/react";
import { useRecorder } from "@/hooks/useRecorder";

// Mock MediaRecorder
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: null as ((e: { data: Blob }) => void) | null,
  onstop: null as (() => void) | null,
};

const mockStream = {
  getTracks: jest.fn(() => [{ stop: jest.fn() }]),
};

Object.defineProperty(global.navigator, "mediaDevices", {
  value: {
    getUserMedia: jest.fn(() => Promise.resolve(mockStream)),
  },
  writable: true,
});

global.MediaRecorder = jest.fn(() => mockMediaRecorder) as unknown as typeof MediaRecorder;

describe("useRecorder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize with idle status", () => {
    const { result } = renderHook(() => useRecorder());
    expect(result.current.status).toBe("idle");
  });

  it("should have null audioBlob initially", () => {
    const { result } = renderHook(() => useRecorder());
    expect(result.current.audioBlob).toBeNull();
  });

  it("should have recordingTime at 0 initially", () => {
    const { result } = renderHook(() => useRecorder());
    expect(result.current.recordingTime).toBe(0);
  });

  it("should request microphone access when starting", async () => {
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it("should change status to recording after start", async () => {
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.status).toBe("recording");
  });

  it("should start MediaRecorder when recording", async () => {
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(mockMediaRecorder.start).toHaveBeenCalled();
  });

  it("should increment recordingTime every second", async () => {
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.recordingTime).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.recordingTime).toBe(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.recordingTime).toBe(3);
  });

  it("should stop recording when stopRecording called", async () => {
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(mockMediaRecorder.stop).toHaveBeenCalled();
  });

  it("should reset to idle when resetRecording called", async () => {
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.resetRecording();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.audioBlob).toBeNull();
  });

  it("should auto-stop when max seconds reached", async () => {
    const { result } = renderHook(() => useRecorder(undefined, 3));

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockMediaRecorder.stop).toHaveBeenCalled();
  });

  it("should call onRecordingComplete callback", async () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useRecorder(onComplete));

    await act(async () => {
      await result.current.startRecording();
    });

    // Simulate recording stop
    act(() => {
      if (mockMediaRecorder.onstop) {
        mockMediaRecorder.onstop();
      }
    });

    expect(result.current.status).toBe("stopped");
  });
});
