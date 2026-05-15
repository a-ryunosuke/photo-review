"use client";

import { useState } from "react";
import { shareToTwitter, shareNative, copyToClipboard, compositeImage } from "@/lib/share";

interface ShareButtonProps {
  text: string;
  photoDataUrl: string;
}

export default function ShareButton({ text, photoDataUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => shareToTwitter(text);

  const handleNativeShare = async () => {
    setSharing(true);
    try {
      const blob = await compositeImage(photoDataUrl, text);
      if (blob) {
        const file = new File([blob], "artism-critique.jpg", { type: "image/jpeg" });
        const shared = await shareNative({
          title: "ARTISM — 現代美術批評",
          text,
          file,
        });
        if (!shared) await handleCopy();
      } else {
        await shareNative({ title: "ARTISM", text });
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="critique__actions">
      {/* コピー */}
      <button
        className="btn btn--ghost"
        onClick={handleCopy}
        aria-label="テキストをコピー"
        id="copy-btn"
      >
        {copied ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            コピー済み
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            テキストコピー
          </>
        )}
      </button>

      {/* Twitter/X */}
      <button
        className="btn btn--twitter"
        onClick={handleTwitter}
        aria-label="Twitter/Xにシェア"
        id="twitter-share-btn"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X でシェア
      </button>

      {/* ネイティブシェア（画像合成） */}
      <button
        className="btn btn--share"
        onClick={handleNativeShare}
        disabled={sharing}
        aria-label="画像としてシェア"
        id="native-share-btn"
      >
        {sharing ? (
          <span className="btn__spinner" />
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        )}
        画像でシェア
      </button>
    </div>
  );
}
