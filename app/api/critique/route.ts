import { GoogleGenerativeAI } from "@google/generative-ai";
import { CRITIQUE_SYSTEM_PROMPT, CRITIQUE_USER_PROMPT } from "@/lib/prompt";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body as { image: string };

    if (!image) {
      return new Response(JSON.stringify({ error: "image is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // data:image/jpeg;base64,xxxx → xxxx
    const base64Data = image.split(",")[1];
    const mimeType = image.split(";")[0].split(":")[1] as
      | "image/jpeg"
      | "image/png"
      | "image/webp";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: CRITIQUE_SYSTEM_PROMPT,
    });

    const result = await model.generateContentStream([
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
      { text: CRITIQUE_USER_PROMPT },
    ]);

    // Server-Sent Events でストリーミング返却
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[critique/route] error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
