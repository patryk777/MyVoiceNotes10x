"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type RecorderStatus = "idle" | "recording" | "stopped";

export function useRecorder(onRecordingComplete?: (blob: Blob) => void, maxSeconds?: number) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const onCompleteRef = useRef(onRecordingComplete);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxSecondsRef = useRef(maxSeconds);

  useEffect(() => {
    onCompleteRef.current = onRecordingComplete;
  }, [onRecordingComplete]);

  useEffect(() => {
    maxSecondsRef.current = maxSeconds;
  }, [maxSeconds]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setStatus("stopped");
        setRecordingTime(0);
        stream.getTracks().forEach((track) => track.stop());
        if (onCompleteRef.current) {
          onCompleteRef.current(blob);
        }
      };

      mediaRecorder.start();
      setStatus("recording");
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          if (maxSecondsRef.current && next >= maxSecondsRef.current) {
            mediaRecorderRef.current?.stop();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [status]);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setStatus("idle");
  }, []);

  return {
    status,
    audioBlob,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
