export default function UpLoadButton({ stage, handleGenerate }) {
    return (
        <div>
        {stage === "preview" && (
            <button
            className="generate-btn"
            onClick={handleGenerate}
            id="generate-btn"
          >
            批評を生成する
          </button>
        )}
        </div>
    )
}