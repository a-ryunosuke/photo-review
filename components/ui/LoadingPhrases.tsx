"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "記号論的構造を解析中…",
  "ポストモダン的文脈を構築中…",
  "アウラの痕跡を探索中…",
  "差異の体系を読解中…",
  "身体性の表象を分析中…",
  "スペクタクルの位相を測定中…",
  "他者性の地平を照射中…",
  "制度批判の座標を算出中…",
  "資本主義的欲望を脱構築中…",
  "日常性の亀裂を検出中…",
];

export default function LoadingPhrases() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className="loading-phrase"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      {PHRASES[index]}
    </p>
  );
}
