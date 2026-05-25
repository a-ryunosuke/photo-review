// AIテキスト

"use client";

import { useEffect, useRef, useState } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number; // ms per character
  onDone?: () => void;
}

export default function TypeWriter({ text, speed = 18, onDone }: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const prevTextRef = useRef("");

  useEffect(() => {
    // テキストが切り替わったらリセット
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      indexRef.current = 0;
      setDisplayed("");
    }

    if (indexRef.current >= text.length) {
      onDone?.();
      return;
    }

    const timer = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(timer);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onDone]);

  return (
    <span className="typewriter">
      {displayed}
      {displayed.length < text.length && (
        <span className="typewriter__cursor" aria-hidden="true">|</span>
      )}
    </span>
  );
}
