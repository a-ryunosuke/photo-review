/**
 * SNSシェアロジック
 */

/** Twitter/X へのシェア */
export function shareToTwitter(text: string): void {
  const hashtags = "現代美術,アンチ美術,ARTISM";
  const encoded = encodeURIComponent(text.slice(0, 240) + "\n\n#" + hashtags.split(",").join(" #"));
  window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank", "noopener,noreferrer");
}

/** Web Share API (iOS/Androidのシステム共有) */
export async function shareNative(params: {
  title: string;
  text: string;
  file?: File;
}): Promise<boolean> {
  if (!navigator.share) return false;

  try {
    if (params.file && navigator.canShare?.({ files: [params.file] })) {
      await navigator.share({
        title: params.title,
        text: params.text,
        files: [params.file],
      });
    } else {
      await navigator.share({
        title: params.title,
        text: params.text,
      });
    }
    return true;
  } catch {
    return false;
  }
}

/** クリップボードにテキストをコピー */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Canvas を使って写真 + 批評文をひとつの画像に合成して返す */
export async function compositeImage(
  photoDataUrl: string,
  critiqueText: string
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve(null);

    const img = new Image();
    img.onload = () => {
      const W = 1080;
      const H = 1080;
      canvas.width = W;
      canvas.height = H;

      // 背景黒
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // 写真を上半分に収める
      const imgAspect = img.width / img.height;
      const photoH = H * 0.55;
      const photoW = photoH * imgAspect;
      const photoX = (W - photoW) / 2;
      ctx.drawImage(img, photoX, 0, photoW, photoH);

      // グラデーションオーバーレイ
      const grad = ctx.createLinearGradient(0, photoH * 0.5, 0, photoH);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, photoH);

      // 批評テキスト
      ctx.fillStyle = "#fff";
      ctx.font = "22px serif";
      const maxWidth = W - 80;
      const lineHeight = 36;
      let y = photoH + 40;
      const words = critiqueText.split("");
      let line = "";
      for (const char of words) {
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          ctx.fillText(line, 40, y);
          line = char;
          y += lineHeight;
          if (y > H - 60) break;
        } else {
          line = testLine;
        }
      }
      if (line) ctx.fillText(line, 40, y);

      // ロゴ
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("ARTISM", W - 100, H - 30);

      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    };
    img.src = photoDataUrl;
  });
}