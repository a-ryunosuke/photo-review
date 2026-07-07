"use client";

import { useRef, useState, useCallback } from "react";
import { pageStyle } from "./dropZone.tv";

const base = pageStyle
const items = pageStyle

interface DropZoneProps {
  onFile: (file: File, dataUrl: string) => void;
}

export default function DropZone({ onFile }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) onFile(file, e.target.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onFile]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // 同じファイルを再選択できるようにリセット
    e.target.value = "";
  };

  return (
    <div className={base()}>
      <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      // className={`dropzone ${isDragging ? "dropzone--dragging" : ""}`}
      className={items()}
      role="button"
      tabIndex={0}
      aria-label="写真をアップロード"
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onInputChange}
        className="sr-only"
        id="photo-input"
        aria-label="写真ファイルを選択"
      />

      <div className="dropzone__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>

      <p className="dropzone__primary">写真をドロップ、またはタップして選択</p>
      <p className="dropzone__secondary">JPEG · PNG · WebP</p>
    </div>
    </div>
  );
}
