"use client";

import DropZone from "../upLoad/DropZone"
import Preview from "../upLoad/Preview"

export default function UpLoading({stage, handleFile, photoDataUrl, handleReset}) {
    return (
        <div>
            {stage === "idle" && (
                <DropZone onFile={handleFile} />
            )}
            {(stage === "preview" || stage === "loading" || stage === "result" || stage === "error") && photoDataUrl && (
                <Preview dataUrl={photoDataUrl} onReset={handleReset} />
            )}
        </div>
    )
}