"use client";

import { useState, useCallback } from "react";

import { pageStyle } from "./page.tv";

import CritiqueText from "@/components/aiText/CritiqueText";
import LoadingPhrases from "@/components/loadingEffect/LoadingPhrases";
import UpLoading from "@/components/upLoad/UpLoading";
import UpLoadButton from "@/components/upLoad/UpLoadButton"
import ErrorList from "@/components/error/ErrorList";

type Stage = "idle" | "preview" | "loading" | "result" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [critique, setCritique] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const base = pageStyle()

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
    <div className={base}>
      {/* ヘッダー */}
      <header className="header">
      </header>

      {/* メイン */}
      <main className="main">

        {/* 写真アップロード */}
        {/* そのボタン */}
        <UpLoading stage={stage} handleFile={handleFile} handleReset={handleReset} photoDataUrl={photoDataUrl} />
        <UpLoadButton stage={stage} handleGenerate={handleGenerate} />

        {/* ローディングエフェクト */}
        {stage === "loading" && (
          <div className="loading-container">
            <div className="loading-spinner" aria-label="生成中" />
            <LoadingPhrases />
          </div>
        )}

        {/* AIテキスト */}
        {(stage === "result") && critique && (
          <>
            <CritiqueText
              text={critique}
              isStreaming={isStreaming}
              photoDataUrl={photoDataUrl}
            />
          </>
        )}

        {/* エラー表示 */}
        {stage === "error" && (
          <>
          <ErrorList
          errorMsg={errorMsg}
          onClick={handleReset}
           />
          </>
        )}
      </main>
    </div>
  );
}
