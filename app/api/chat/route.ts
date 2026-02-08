import { NextRequest, NextResponse } from "next/server";
import { detectIntent, generateResponse } from "@/ai/intentDetection";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 },
      );
    }

    // Detect intent
    const intent = detectIntent(message);

    // Generate response
    const response = generateResponse(intent);

    return NextResponse.json({
      intent,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
