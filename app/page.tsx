"use client";

import { useState, useCallback } from "react";
import DropZone from "@/components/upLoad/DropZone";
import Preview from "@/components/upLoad/Preview";
import CritiqueText from "@/components/critique/CritiqueText";
import LoadingPhrases from "@/components/ui/LoadingPhrases";

type Stage = "idle" | "preview" | "loading" | "result" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [critique, setCritique] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFile = useCallback((_file: File, dataUrl: string) => {
    setPhotoDataUrl(dataUrl);
    setCritique("");
    setErrorMsg("");
    setStage("preview");
  }, []);

  const handleReset = () => {
    setPhotoDataUrl("");
    setCritique("");
    setErrorMsg("");
    setStage("idle");
  };

  const handleGenerate = async () => {
    if (!photoDataUrl) return;
    setStage("loading");
    setCritique("");
    setIsStreaming(false);

    try {
      const res = await fetch("/api/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photoDataUrl }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      // SSE ストリーミング読み取り
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      setStage("result");
      setIsStreaming(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            setIsStreaming(false);
            return;
          }
          try {
            const { text } = JSON.parse(payload) as { text: string };
            full += text;
            setCritique(full);
          } catch {
            /* ignore malformed lines */
          }
        }
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "エラーが発生しました");
      setStage("error");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="layout">
      {/* ヘッダー */}
      <header className="header">
        <h1 className="header__logo">Artism</h1>
        <p className="header__tagline">Anti-Art Critique Generator</p>
        <div className="header__rule" aria-hidden="true" />
      </header>

      {/* メイン */}
      <main className="main">
        {/* 写真エリア */}
        {stage === "idle" && (
          <DropZone onFile={handleFile} />
        )}

        {(stage === "preview" || stage === "loading" || stage === "result" || stage === "error") && photoDataUrl && (
          <Preview dataUrl={photoDataUrl} onReset={handleReset} />
        )}

        {/* 生成ボタン */}
        {stage === "preview" && (
          <button
            className="generate-btn"
            onClick={handleGenerate}
            id="generate-btn"
          >
            批評を生成する
          </button>
        )}

        {/* ローディング */}
        {stage === "loading" && (
          <div className="loading-container">
            <div className="loading-spinner" aria-label="生成中" />
            <LoadingPhrases />
          </div>
        )}

        {/* 批評文 */}
        {(stage === "result") && critique && (
          <>
            <CritiqueText
              text={critique}
              isStreaming={isStreaming}
              photoDataUrl={photoDataUrl}
            />
            {!isStreaming && (
              <button
                className="generate-btn"
                onClick={handleReset}
                id="restart-btn"
                style={{ marginTop: 0 }}
              >
                別の写真で試す
              </button>
            )}
          </>
        )}

        {/* エラー */}
        {stage === "error" && (
          <>
            <div className="error-box" role="alert">
              <strong>エラーが発生しました</strong><br />
              {errorMsg}<br /><br />
              <small>APIキーが設定されているか確認してください。</small>
            </div>
            <button className="generate-btn" onClick={handleReset} id="error-reset-btn">
              やり直す
            </button>
          </>
        )}
      </main>
    </div>
  );
}
