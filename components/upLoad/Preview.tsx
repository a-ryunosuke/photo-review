"use client";

import Image from "next/image";

interface PreviewProps {
  dataUrl: string;
  onReset: () => void;
}

export default function Preview({ dataUrl, onReset }: PreviewProps) {
  return (
    <div className="preview">
      <div className="preview__image-wrap">
        <Image
          src={dataUrl}
          alt="アップロードされた写真"
          fill
          className="preview__image"
          unoptimized
        />
      </div>
      <button
        onClick={onReset}
        className="preview__reset"
        aria-label="別の写真を選ぶ"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        別の写真
      </button>
    </div>
  );
}
