"use client";

import { Mic, Square, Loader2 } from "lucide-react";
import { RecorderStatus } from "@/hooks/useRecorder";

interface RecordingSectionProps {
  status: RecorderStatus;
  recordingTime: number;
  maxRecordingSeconds: number;
  isProcessing: boolean;
  processingStatus: string;
  onMicClick: () => void;
  t: (key: string) => string;
}

export function RecordingSection({
  status,
  recordingTime,
  maxRecordingSeconds,
  isProcessing,
  processingStatus,
  onMicClick,
  t,
}: RecordingSectionProps) {
  const isWorking = isProcessing;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onMicClick}
        onTouchEnd={(e) => {
          e.preventDefault();
          if (!isWorking) onMicClick();
        }}
        disabled={isWorking}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all touch-manipulation select-none z-10 ${
          status === "recording"
            ? "bg-red-600 animate-pulse"
            : "bg-red-600 hover:bg-red-500 active:bg-red-400"
        } ${isWorking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={status === "recording" ? "Stop recording" : "Start recording"}
        title={status === "recording" ? "⏹️ Zatrzymaj nagrywanie - kliknij aby zakończyć i przetworzyć" : "🎤 Nagraj notatkę - kliknij i mów, AI automatycznie przetworzy"}
      >
        {isWorking ? (
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
        ) : status === "recording" ? (
          <Square className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        )}
      </button>

      <div className="flex flex-col">
        {status === "idle" && !isWorking && (
          <p className="text-zinc-400 text-sm">{t("clickToRecord")}</p>
        )}
        {status === "recording" && (
          <p className="text-red-400 text-sm">
            {t("recording")} {Math.floor(recordingTime / 60)}:
            {(recordingTime % 60).toString().padStart(2, "0")} /{" "}
            {Math.floor(maxRecordingSeconds / 60)}:
            {(maxRecordingSeconds % 60).toString().padStart(2, "0")}
          </p>
        )}
        {processingStatus && (
          <p className="text-blue-400 text-sm">{processingStatus}</p>
        )}
      </div>
    </div>
  );
}
