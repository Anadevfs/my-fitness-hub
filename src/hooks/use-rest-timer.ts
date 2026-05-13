import { useEffect, useMemo, useRef, useState } from "react";

type TimerStatus = "idle" | "running" | "paused" | "finished";

export function useRestTimer() {
  const [duration, setDuration] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "running") return;

    intervalRef.current = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(intervalRef.current ?? undefined);
          intervalRef.current = null;
          setStatus("finished");
          vibrate();
          playFinishTone();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  const progress = useMemo(() => {
    if (!duration) return 0;
    return ((duration - remaining) / duration) * 100;
  }, [duration, remaining]);

  function start(seconds: number) {
    setDuration(seconds);
    setRemaining(seconds);
    setStatus("running");
  }

  function pause() {
    if (status === "running") setStatus("paused");
  }

  function resume() {
    if (status === "paused") setStatus("running");
  }

  function reset() {
    setDuration(0);
    setRemaining(0);
    setStatus("idle");
  }

  return {
    duration,
    isActive: status === "running" || status === "paused",
    pause,
    progress,
    remaining,
    reset,
    resume,
    start,
    status,
  };
}

function vibrate() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([180, 80, 180]);
  }
}

function playFinishTone() {
  if (typeof window === "undefined") return;

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 740;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch {
    // Audio can be blocked by the browser; vibration still covers supported mobile devices.
  }
}
