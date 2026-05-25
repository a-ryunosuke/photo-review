"use client";

import { useEffect, useState } from "react";

// ローディング中、表示する文字
const PHRASES = [
  "",
  "・",
  "・・",
  "・・・"
];

export default function LoadingPhrases() {
  const [index, setIndex] = useState(0);
  // const [visible, setVisible] = useState(true);

  // ボタンが押されたら処理開始
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className="loading-phrase"
      style={{  transition: "opacity 0.4s ease" }}
    >
      批評文を生成中{PHRASES[index]}
    </p>
  );
}
